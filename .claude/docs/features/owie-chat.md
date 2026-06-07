# Owie Chat

**Status: LIVE.** Public at `/owie-chat` (landing) + `/chat` (full app). No auth required, free.

---

## Architecture

```
/chat (page.tsx)
  └── ChatPageClient (client, 'use client')
        ├── useChatRuntime({ transport: AssistantChatTransport({ api: '/api/chat' }) })
        ├── localStorage sync (onFinish callback, debounced 500ms)
        └── <AssistantRuntimeProvider> → <Thread />

/api/chat/route.ts (server)
  ├── IP rate limit (in-memory Map, 20 req/min → 429)
  ├── fetchSystemPrompt() from Langfuse (60s cache)
  ├── convertToModelMessages(uiMessages.slice(-12))
  └── streamText(openrouter(model), tools, stopWhen: stepCountIs(5))
        └── onFinish → appendChatLog() + sendChatTrace()
```

**No server-side history.** localStorage (IndexedDB) only. Anonymous users.

---

## Route handler (`app/api/chat/route.ts`)

- Model: `CHAT_MODEL` env var, fallback `DEFAULT_MODEL`
- MCP: `OPENWALLET_MCP_URL` (default `http://localhost:8001`) + `OPENWALLET_MCP_KEY`
- Rate limit: 20 req/min per IP, in-memory Map — replace with Upstash Redis for multi-instance prod
- `result.consumeStream()` without await — ensures `onFinish` fires even if client disconnects

---

## AI SDK v6 gotchas

### UIMessage vs ModelMessage

Client sends `UIMessage[]` (has `parts`, `metadata`, `id`). `streamText` needs `ModelMessage[]`.
Always convert at route boundary:

```ts
const messages = await convertToModelMessages(uiMessages.slice(-12));
```

### API changes from v4/v5

- `tool()`: `parameters` → `inputSchema`
- `maxSteps: 5` → `stopWhen: stepCountIs(5)` (import `stepCountIs` from `ai`)
- `result.toDataStreamResponse()` → `result.toUIMessageStreamResponse()`

### consumeStream pattern

`onFinish` requires stream fully consumed. Browser disconnects kill handler before `onFinish` fires.

```ts
result.consumeStream(); // no await - ensures onFinish fires even if client disconnects
return result.toUIMessageStreamResponse();
```

What does NOT work:

- `after(() => sendChatTrace(...))` inside `onFinish` — `after()` must register synchronously in route scope
- `await after(result.consumeStream())` — type error + wrong behavior

---

## assistant-ui setup

```ts
const runtime = useChatRuntime({
    transport: new AssistantChatTransport({api: '/api/chat'}),
    messages: initialMessages,   // UIMessage[] for pre-loading history
    onFinish: ({messages}) => save(messages),
});
```

Install components: `npx assistant-ui@latest add thread --path components/assistant-ui`
(Not `npx assistant-ui@latest init` alone — files end up missing without `--path`.)

---

## Local dev logging

Dev only (`NODE_ENV=development`). Writes to `logs/chat-<sessionId>.log` (gitignored).
One JSON line per AI response (NDJSON). Same session appends, new session = new file.

### Log entry shape

```json
{
  "ts": "2026-06-05T04:58:30.278Z",
  "sessionId": "d4810ef7-...",
  "userId": "keen-beaver-4431",
  "ip": "::1",
  "model": "nvidia/nemotron-...",
  "messages": [
    ...
  ],
  "steps": [
    {
      "text": "...",
      "toolCalls": [
        {
          "toolName": "rank-cards-for-spend",
          "args": {}
        }
      ],
      "toolResults": [
        {
          "toolName": "rank-cards-for-spend",
          "result": {}
        }
      ]
    }
  ],
  "finalText": "...",
  "inputTokens": 4243,
  "outputTokens": 326,
  "latencyMs": 24412,
  "finishReason": "stop"
}
```

### CLI commands

```bash
pnpm chatlog                    # stream all sessions (pretty via jq)
pnpm chatlog:id <sessionId>     # stream one session
```

---

## Observability (Langfuse)

All observability uses Langfuse direct HTTP ingestion — no SDK (JS SDK silently fails in CF Workers, GitHub issue
#11984).

**File:** `lib/langfuse.ts`

- `fetchSystemPrompt()` — fetches `chat-system-prompt?label=production`, 60s in-memory cache, falls back to hardcoded
  `SYSTEM_PROMPT` on error
- `sendChatTrace()` — sends trace with input/output/model/tokens/latency/finishReason/steps/promptVersion

**Trace fields:**

| Field           | Source                                     |
|-----------------|--------------------------------------------|
| `input`         | Last user message text                     |
| `output`        | Full assistant response                    |
| `model`         | `CHAT_MODEL` / `DEFAULT_MODEL` env var     |
| `tokens.input`  | `usage.inputTokens` from AI SDK `onFinish` |
| `tokens.output` | `usage.outputTokens`                       |
| `latencyMs`     | `Date.now() - startTime`                   |
| `finishReason`  | From `onFinish`                            |
| `steps`         | `steps.length` (tool call count)           |
| `promptVersion` | From Langfuse prompt fetch                 |

**LLM-as-Judge evaluator** configured in Langfuse UI → Evaluators:

- Target: Live Traces, filter trace name = `chat`
- Model: setup in Langfuse UI
- Scores appear in Evaluation → Scores automatically

**Env vars:**

```
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

**Known quirk:** `score-create` in batch ingestion (`POST /api/public/ingestion`) silently accepted but never stored.
Always use `POST /api/public/scores` for scores.

---

## System prompt

Lives in Langfuse UI: Prompts → `chat-system-prompt` label=`production`.
Edit in UI → new version tagged `production` → live within 60s (cache TTL).
Hardcoded fallback in `lib/chat/system-prompt.ts` used when Langfuse unreachable.

Edit workflow: use `/edit-system-prompt` command. Confirm with user before running `pnpm push:prompt`.

---

## MCP tools

Owie uses all 13 tools from the OpenWallet MCP server. Full tool list and connection details: `features/openwallet-mcp.md`.

Local dev: MCP server falls back to `http://localhost:8001`. Prod: `OPENWALLET_MCP_URL` env var.

---

## Core question categories

### Cat A: Card discovery (user has no cards yet)

| #  | Question                                       | Tools                                     |
|----|------------------------------------------------|-------------------------------------------|
| A1 | "Thẻ nào phù hợp chi tiêu của tôi?"            | `rank-cards-for-spend`                    |
| A2 | "Thẻ nào tốt cho Shopee / Grab / TikTok Shop?" | `list-merchants` → `rank-cards-for-spend` |
| A3 | "Thẻ không phí thường niên tốt nhất?"          | `rank-cards-for-spend` (constraint)       |
| A4 | "Tôi hay đi du lịch, thẻ nào?"                 | `list-personas` → `rank-cards-for-spend`  |
| A5 | "VCB có những thẻ gì?"                         | `find-bank` → `search-cards`              |

### Cat B: Spend optimization (user has cards)

| #  | Question                                        | Tools                                 |
|----|-------------------------------------------------|---------------------------------------|
| B1 | "Tôi có thẻ A và B, nên dùng thẻ nào mua xăng?" | `find-card` × N → `cashback-card` × N |
| B2 | "Thẻ X hoàn tiền bao nhiêu cho Shopee?"         | `find-card` → `cashback-card`         |

### Cat C: Card research

| #  | Question                  | Tools                             |
|----|---------------------------|-----------------------------------|
| C1 | "Phí thường niên thẻ X?"  | `find-card` → `get-card-detail`   |
| C2 | "So sánh thẻ A vs B"      | `find-card` × 2 → `compare-cards` |
| C3 | "Thẻ nào tương tự thẻ X?" | `find-card` → `related-cards`     |
| C4 | "Techcom có thẻ gì?"      | `find-bank` → `search-cards`      |

---

## What NOT to do

- No wallet integration with chat
- No persistent server-side chat history — localStorage only
- No user auth — anonymous only

---

## Eval harness

Offline eval harness for the chat system prompt. Runs test cases against live chat API, checks responses with
deterministic rules, pushes traces to Langfuse. Langfuse runs LLM-as-judge automatically on every pushed trace.

### Architecture

```
evals/
  cases/             JSON test case definitions (30 cases)

scripts/
  eval-chat.ts       Harness - runs cases, rule checks, pushes to Langfuse (v5 SDK)
  push-prompt.ts     Pushes lib/chat/system-prompt.ts → Langfuse as 'chat-system-prompt'
```

### Data flow

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

### Scores per trace

| Score name            | Source                     | Range  | Meaning                                                |
|-----------------------|----------------------------|--------|--------------------------------------------------------|
| `rule-pass`           | our code                   | 0 or 1 | deterministic rule check (contains/notContains/custom) |
| `card-advice-quality` | Langfuse evaluator (cloud) | 0–1    | LLM judge quality score, runs async after push         |

No local judge. Removed `judgeResponse()` — Gemini ignores both `response_format: json_object` (OpenAI param, silently
ignored) and `json_schema` via OpenRouter passthrough. Langfuse built-in evaluator handles judging with a reliable
model.

### Running evals

```bash
pnpm eval                            # all cases
pnpm eval --case A2-merchant-shopee  # one case by ID
EVAL_CASE_IDS=id1,id2 pnpm eval     # multiple cases
```

Dev server must be running (`pnpm dev`).

Required env vars in `.env.local`:

```
OPENROUTER_API_KEY=...
EVAL_CHAT_MODEL=google/gemini-3.5-flash
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

### SDK versions

We use **Langfuse JS/TS SDK v5** (OTel-based), NOT legacy `langfuse` v3.

| Package                   | Version | Purpose                                                  |
|---------------------------|---------|----------------------------------------------------------|
| `@langfuse/tracing`       | 5.4.1   | `startObservation`, `propagateAttributes`                |
| `@langfuse/otel`          | 5.4.1   | `LangfuseSpanProcessor` — exports OTel spans to Langfuse |
| `@langfuse/client`        | 5.4.1   | `LangfuseClient` — scoring, prompt management            |
| `@opentelemetry/sdk-node` | 0.218.0 | OTel NodeSDK required by v5                              |

Why v5: observation-level evaluators require SDK v4+. v5 is latest. Old `langfuse` npm (v3) only supports trace-level
scoring.

### Langfuse evaluator setup

Evaluator name: `card-advice-quality`
Target: **Live Observations** (requires v5 OTel SDK)
Filter: `tags contains eval`
Environment: `default` (must match — traces push with `environment: default`)
Variable mapping: `{{input}}` → observation input, `{{output}}` → observation output

**If evaluator stops running:** check environment filter in dashboard — must be `default` not `production`.

### Test cases (30 total)

| Category          | IDs                                                                                                                                         | Purpose                                                               |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| Cat A (find card) | A1-spend-basic, A1-spend-multi, A2-merchant-shopee, A2-merchant-tiktok, A3-no-fee, A4-persona-traveler, A4-persona-commuter, A5-bank-browse | Spend-based recommendations, merchant intent, personas, bank browsing |
| Cat B (optimize)  | B1-multi-card-optimize, B2-cashback-query                                                                                                   | Multi-card cashback comparison                                        |
| Cat C (research)  | C1-card-fees, C2-compare, C3-related, C4-bank-cards                                                                                         | Card details, comparison, related cards                               |
| Guards            | guard-invented-rate, guard-nonexistent-bank, guard-ambiguous-bank                                                                           | Hallucination prevention                                              |
| Happy path        | happy-path-* (7 cases)                                                                                                                      | Core features end-to-end                                              |
| Hallucination     | hallucination-guard-* (2 cases)                                                                                                             | No fabricated rates                                                   |
| Out of scope      | out-of-scope-* (3 cases)                                                                                                                    | Gold, stocks, real estate must be refused                             |
| Vague             | vague-query-best-card                                                                                                                       | Must ask for context                                                  |

### Adding a test case

1. Create `evals/cases/{id}.json` (see existing files for schema)
2. If `customDescription` set → add predicate to `customChecks` in `scripts/eval-chat.ts`
3. Tags: use existing categories or add new ones (appear in Langfuse trace tags)

### Known issues and gotchas

**Gemini stops after tool calls:** `google/gemini-3.5-flash` via OpenRouter returns `finishReason: "tool-calls"` and
never generates user-facing text. Stream ends with zero `text-delta` chunks.

Fix in eval: stream parser collects both `text-delta` AND `tool-output-available` chunks. If no text parts, falls back
to tool output JSON as response. Rule checks run on tool output JSON.

Real issue: users in browser are fine because `assistant-ui` handles multi-turn. Raw API consumers (evals, direct calls)
get empty responses.

**`response_format` for Gemini via OpenRouter:** `response_format: { type: "json_object" }` is OpenAI-specific. Gemini
ignores it via OpenRouter passthrough. Don't rely on structured output params for cross-model judge logic.

**Old scores in Langfuse:** Runs before 2026-06-04 have `judge-score` (value 0.5) from broken local judge. Ignore.
Filter by `card-advice-quality` going forward.

### Eval workflow

1. Edit system prompt in `lib/chat/system-prompt.ts`
2. `pnpm push:prompt` — push new version to Langfuse (confirm with user first)
3. `pnpm eval` — run all cases
4. Check Langfuse dashboard → Traces (filter tag: `eval`) → `card-advice-quality` scores
5. Compare avg score vs previous prompt version
6. Ship if improved
