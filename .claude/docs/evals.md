# Evals System

Offline eval harness for the chat system prompt. Runs test cases against the live chat API, checks responses with deterministic rules, and pushes traces to Langfuse. Langfuse runs LLM-as-a-judge automatically on every pushed trace.

## Architecture

```
evals/
  cases/             JSON test case definitions (30 cases)

scripts/
  eval-chat.ts       Harness — runs cases, rule checks, pushes to Langfuse (v5 SDK)
  push-prompt.ts     Pushes lib/chat/system-prompt.ts → Langfuse as 'chat-system-prompt'
```

## Data flow

```
pnpm eval
  → load cases from evals/cases/*.json
  → fetch prompt version from Langfuse (chat-system-prompt?label=production)
  → for each case:
      send message to /api/chat
      parse AI SDK SSE stream (text-delta chunks + tool-output-available fallback)
      run rule check (contains / notContains / custom predicate)
      push trace + generation observation via @langfuse/tracing v5 (OTel-based)
      push rule-pass score via @langfuse/client
  → print summary table
  → Langfuse cloud: evaluator 'card-advice-quality' auto-scores each generation async
```

## Scores per trace

| Score name | Source | Range | Meaning |
|---|---|---|---|
| `rule-pass` | our code | 0 or 1 | deterministic rule check (contains/notContains/custom) |
| `card-advice-quality` | Langfuse evaluator (cloud) | 0–1 | LLM judge quality score, runs async after push |

**No local judge.** We removed our own `judgeResponse()` function entirely — it was broken because Gemini ignores both `response_format: json_object` (OpenAI param, silently ignored) and `json_schema` via OpenRouter passthrough. Langfuse's built-in evaluator handles judging with a reliable model.

## Running evals

```bash
pnpm eval                          # all cases
pnpm eval --case A2-merchant-shopee  # one case by ID
EVAL_CASE_IDS=id1,id2 pnpm eval    # multiple cases
```

Dev server must be running (`pnpm dev`).

**Required env vars in `.env.local`:**
```
OPENROUTER_API_KEY=...
EVAL_CHAT_MODEL=google/gemini-3.5-flash
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

## Pushing the system prompt

```bash
pnpm push:prompt
```

Reads `SYSTEM_PROMPT` from `lib/chat/system-prompt.ts`, pushes to Langfuse as `chat-system-prompt` with label `production`. Run this after editing the system prompt so Langfuse tracks versions.

## Langfuse evaluator setup

Evaluator name: `card-advice-quality`  
Target: **Live Observations** (requires v5 OTel SDK — we use `@langfuse/tracing` + `@langfuse/otel` v5.4.1)  
Filter: `tags contains eval`  
Environment: `default` (must match — our traces push with `environment: default`)  
Variable mapping: `{{input}}` → observation input, `{{output}}` → observation output

**If evaluator stops running:** check environment filter in dashboard — must be `default` not `production`.

**Timing:** evaluator runs async, ~10-30s after trace push. Not instant.

## SDK versions (important)

We use **Langfuse JS/TS SDK v5** (OTel-based), NOT the legacy `langfuse` v3 package.

| Package | Version | Purpose |
|---|---|---|
| `@langfuse/tracing` | 5.4.1 | `startObservation`, `propagateAttributes` |
| `@langfuse/otel` | 5.4.1 | `LangfuseSpanProcessor` — exports OTel spans to Langfuse |
| `@langfuse/client` | 5.4.1 | `LangfuseClient` — scoring, prompt management |
| `@opentelemetry/sdk-node` | 0.218.0 | OTel NodeSDK required by v5 |

**Why v5:** Langfuse observation-level evaluators require SDK v4+. v5 is latest (v4 was intermediate, docs say go straight to v5). The old `langfuse` npm package (v3) only supports trace-level scoring — evaluators can't target individual observations.

## Known issues and gotchas

### Gemini stops after tool calls
`google/gemini-3.5-flash` via OpenRouter returns `finishReason: "tool-calls"` after MCP tool calls and never generates user-facing text. Stream ends with zero `text-delta` chunks.

**Fix in eval:** stream parser collects both `text-delta` AND `tool-output-available` chunks. If no text parts, falls back to tool output JSON as response. Rule checks run on tool output JSON — custom predicates check for keywords in the JSON.

**Real issue:** users in browser are fine because `assistant-ui` handles multi-turn. Raw API consumers (evals, direct API calls) get empty responses. Not fixed in system prompt — model behavior.

### response_format for Gemini via OpenRouter
`response_format: { type: "json_object" }` is an OpenAI-specific param. Gemini ignores it via OpenRouter passthrough.  
`response_format: { type: "json_schema", ... }` — Gemini supports this natively (confirmed in Google AI docs), but OpenRouter passthrough behavior is inconsistent.  
**Lesson:** don't rely on structured output params for cross-model judge logic. Delegate judging to Langfuse which handles model-specific structured output internally.

### Old scores in Langfuse
Old runs from before the cleanup have `judge-score` (value 0.5) pushed via REST API — these are from our broken local judge (always returned 50 when parse failed). Ignore scores from before 2026-06-04. Filter by `card-advice-quality` name going forward.

### Environment filter
Langfuse evaluators have an environment filter. Our traces push as `environment: default` (OTel default). If you create a new evaluator, make sure the environment filter is set to `default` or removed, not `production`.

## Workflow

1. Edit system prompt in `lib/chat/system-prompt.ts`
2. `pnpm push:prompt` — push new version to Langfuse
3. `pnpm eval` — run all cases
4. Check Langfuse dashboard → Traces (filter tag: `eval`) → `card-advice-quality` scores
5. Compare avg score vs previous prompt version
6. Ship if improved

## Viewing results

**Langfuse → Tracing → Traces** — filter tag `eval`  
**Per trace:** see `rule-pass` score (immediate) + `card-advice-quality` score (async, ~30s lag)  
**Compare runs:** Langfuse → Evaluation → Scores — filter by score name, group by `run_id` metadata

## Test cases (30 total)

| Category | IDs | Purpose |
|---|---|---|
| Cat A (find card) | A1-spend-basic, A1-spend-multi, A2-merchant-shopee, A2-merchant-tiktok, A3-no-fee, A4-persona-traveler, A4-persona-commuter, A5-bank-browse | Spend-based recommendations, merchant intent, personas, bank browsing |
| Cat B (optimize) | B1-multi-card-optimize, B2-cashback-query | Multi-card cashback comparison |
| Cat C (research) | C1-card-fees, C2-compare, C3-related, C4-bank-cards | Card details, comparison, related cards |
| Guards | guard-invented-rate, guard-nonexistent-bank, guard-ambiguous-bank | Hallucination prevention |
| Happy path | happy-path-* (7 cases) | Core features end-to-end |
| Hallucination | hallucination-guard-* (2 cases) | No fabricated rates |
| Out of scope | out-of-scope-* (3 cases) | Gold, stocks, real estate must be refused |
| Vague | vague-query-best-card | Must ask for context |

## Adding a new test case

1. Create `evals/cases/{id}.json` (see existing files for schema)
2. If `customDescription` set → add predicate to `customChecks` in `scripts/eval-chat.ts`
3. Tags: use existing categories or add new ones (they appear in Langfuse trace tags)
