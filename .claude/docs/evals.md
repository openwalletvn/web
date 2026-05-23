# Evals System

Audit tool for the chat system prompt (`lib/chat/system-prompt.ts`). Runs LLM test cases against the live chat API, judges responses, and pushes results to GitHub for review.

## Purpose

Read eval results to understand how prompt changes affect AI behavior. The evals UI shows the full system prompt per run alongside each test case result so prompt engineers can read responses and identify what to fix.

## Architecture

```
evals/
  server.ts          Express server (port 3006) — triggers evals, streams stdout via SSE
  wrangler.toml      Cloudflare Pages config for evals UI
  cases/             JSON test case definitions (13 cases)
  ui/                React + Vite frontend (port 3005)
    src/
      main.tsx       Global CSS vars + router
      types.ts       EvalResult, RunSummary interfaces
      github.ts      Fetches results from openwalletvn/evals GitHub repo
      pages/EvalsPage.tsx
      components/
        TriggerButton.tsx   SSE progress terminal
        RunList.tsx         Run cards with tag summary + trigger badge
        RunDetail.tsx       System prompt + full test case cards
        PromptCompare.tsx   (kept, not wired up — future compare feature)

scripts/
  eval-chat.ts       Main harness — runs cases, judges, pushes JSONL to GitHub
```

## Data flow

1. `eval-chat.ts` runs all cases sequentially against `CHAT_URL` (default: `http://localhost:3000/api/chat`)
2. Each case: send message → parse AI SDK stream → rule check → LLM judge (Groq) → write result
3. Results pushed as JSONL to `openwalletvn/evals` GitHub repo: `results/{YYYY-MM-DD}/run-{runId}.jsonl`
4. Evals UI reads results from GitHub API (public repo, no auth needed)

## EvalResult schema

```ts
{
  run_id: string;           // "{timestamp}-{promptSHA7}"
  prompt_version: string;   // full git SHA of system-prompt.ts
  system_prompt: string;    // full raw content of lib/chat/system-prompt.ts at run time
  triggered_by: string;     // 'ui' | 'cli' | 'ci'
  model: string;            // CHAT_MODEL env var
  judge_model: string;      // JUDGE_MODEL env var
  test_id: string;          // case id
  test_name: string;        // human readable name
  tags: string[];           // e.g. ['happy-path', 'cashback']
  input: string;            // user message sent to chat
  response: string;         // full AI response text
  rule_pass: boolean;       // contains/notContains/custom check result
  score: number;            // 1-100 from LLM judge
  pass: boolean;            // rule_pass && score >= 60
  judge_reasoning: string;  // one-sentence judge explanation
  latency_ms: number;
  timestamp: string;        // ISO 8601
}
```

## Test cases (13 total)

| Category | Count | Purpose |
|----------|-------|---------|
| happy-path | 7 | Core features: banks, recommend, compare, fees, travel, no-annual-fee, installment |
| hallucination-guard | 2 | Non-existent cards — model must not fabricate rates |
| out-of-scope | 3 | Gold, stocks, real estate — model must refuse and redirect |
| vague-query | 1 | "Thẻ nào tốt nhất?" — model must ask for context |

## Running evals

**Via UI (localhost):** Click "Run Evals" button — streams live output in terminal panel.

**Via CLI:**
```bash
npx tsx scripts/eval-chat.ts                          # all cases
npx tsx scripts/eval-chat.ts --case happy-path-shopee-cashback  # one case
EVAL_CASE_IDS=id1,id2 npx tsx scripts/eval-chat.ts   # multiple cases
NO_GITHUB_PUSH=true npx tsx scripts/eval-chat.ts      # skip push
```

**Via CI (GitHub Actions):** Set `CI=true` env — `triggered_by` field auto-detects as `'ci'`.

**Required env vars in `.env.local`:**
```
GROQ_API_KEY=...
CHAT_MODEL=llama-3.3-70b-versatile
JUDGE_MODEL=llama-3.3-70b-versatile
GITHUB_TOKEN=...       # needs repo write access to openwalletvn/evals
CHAT_URL=http://localhost:3000/api/chat
EVALS_REPO=openwalletvn/evals
```

## Running the server

```bash
pnpm admin   # starts evals server on :3006 alongside admin UI
```

The evals UI proxies `/server/*` to `:3006` and `/api/*` to the Next.js dev server.

## UI features

- **Case selector** — dropdown grouped by tag; pick one case or run all
- **Push to GitHub toggle** — checkbox before Run; uncheck to test locally without polluting results
- **Re-run failures** — "↺ Re-run N failures" button appears after selecting a run with failures
- **Delete run** — ✕ button per run card; proxies `DELETE` to GitHub Contents API via server
- **Live progress terminal** — SSE stream: current case name + N/M counter while running
- **Trigger badge** — shows `ui` / `cli` / `ci` per run
- **Score trend** — ↑/↓ arrow vs previous run's avg score
- **Tag summary** — per-tag pass rate (happy-path, hallucination-guard, etc.)
- **System prompt** — full `system-prompt.ts` content at run time, expandable; "view on GitHub ↗" links to that exact SHA
- **Test case cards** — FAIL cases shown first; AI response expandable with copy button; inline re-run per case
- **Judge/rule disagreement** — flagged when rule_pass and score disagree (signals bad rule or bad judge rubric)

## Adding a new test case

1. Create `evals/cases/{id}.json` (see existing files for schema)
2. If `customDescription` is set, add a matching predicate to `customChecks` in `scripts/eval-chat.ts`
3. Tags: use `happy-path`, `hallucination-guard`, `out-of-scope`, `vague-query`, or add new ones

## Storage

Results repo: `openwalletvn/evals` (public GitHub repo)
Path: `results/{YYYY-MM-DD}/run-{runId}.jsonl`
