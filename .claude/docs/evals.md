# Evals System

Offline eval harness for the chat system prompt. Runs LLM test cases against the live chat API, judges responses, and pushes results + scores to Langfuse.

## Architecture

```
evals/
  cases/             JSON test case definitions (13 cases)

scripts/
  eval-chat.ts       Main harness — runs cases, judges, pushes to Langfuse
```

The old evals UI (`evals/ui/`, `evals/server.ts`) and `openwalletvn/evals` GitHub repo have been deleted. Results now live in Langfuse.

## Data flow

1. `eval-chat.ts` fetches current prompt version from Langfuse (`chat-system-prompt?label=production`)
2. Runs each case against `CHAT_URL` (default: `http://localhost:3000/api/chat`)
3. Each case: send message → parse AI SDK stream → rule check → LLM judge (Groq)
4. Pushes traces to Langfuse via `POST /api/public/ingestion`
5. Pushes scores to Langfuse via `POST /api/public/scores` (one `judge-score` + one `rule-pass` per case)

> **Note:** Do NOT use batch ingestion (`score-create` type) for scores — Langfuse silently ignores them. Always use `POST /api/public/scores` directly.

## Scores per trace

| Score name | Type | Range | Meaning |
|------------|------|-------|---------|
| `judge-score` | NUMERIC | 0–1 | LLM judge quality score (raw 1-100 divided by 100) |
| `rule-pass` | NUMERIC | 0 or 1 | Rule check result (contains/notContains/custom predicate) |

## Running evals

```bash
pnpm eval                                        # all 13 cases
EVAL_CASE_IDS=hallucination-guard-fake-card pnpm eval  # one case
EVAL_CASE_IDS=id1,id2 pnpm eval                 # multiple cases
```

Dev server must be running (`pnpm dev`).

**Required env vars in `.env.local`:**
```
GROQ_API_KEY=...
CHAT_MODEL=llama-3.3-70b-versatile
JUDGE_MODEL=llama-3.3-70b-versatile
LANGFUSE_PUBLIC_KEY=...
LANGFUSE_SECRET_KEY=...
LANGFUSE_BASE_URL=https://cloud.langfuse.com
CHAT_URL=http://localhost:3000/api/chat
```

## Viewing results

**Langfuse → Tracing → Traces** — filter by tag `eval`
**Langfuse → Evaluation → Scores** — `judge-score` and `rule-pass` per trace

## Workflow

1. Edit system prompt in Langfuse UI (Prompt Management → `chat-system-prompt`)
2. `pnpm eval`
3. Check scores in Langfuse — did avg `judge-score` improve?
4. Ship if improved

## Test cases (13 total)

| Category | Count | Purpose |
|----------|-------|---------|
| happy-path | 7 | Core features: banks, recommend, compare, fees, travel, no-annual-fee, installment |
| hallucination-guard | 2 | Non-existent cards — model must not fabricate rates |
| out-of-scope | 3 | Gold, stocks, real estate — model must refuse and redirect |
| vague-query | 1 | "Thẻ nào tốt nhất?" — model must ask for context |

## Adding a new test case

1. Create `evals/cases/{id}.json` (see existing files for schema)
2. If `customDescription` is set, add a matching predicate to `customChecks` in `scripts/eval-chat.ts`
3. Tags: use `happy-path`, `hallucination-guard`, `out-of-scope`, `vague-query`, or add new ones
