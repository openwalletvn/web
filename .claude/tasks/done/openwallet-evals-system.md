# OpenWallet Evals System

**Branch:** Create `feature/evals-system` from `preview` before starting any work.

```bash
git checkout preview
git pull origin preview
git checkout -b feature/evals-system
```

---

## Current state

- `scripts/eval-chat.ts` - eval harness with **8 inline test cases**, no JSONL output, no LLM judge, no GitHub push
- `admin/server.ts` - Express on port 3004, serves static HTML (`blog-post.html`). **No Vite/React UI exists yet.**
- `lib/chat/system-prompt.ts` - single file, git commit hash of this = prompt version
- No `.github/workflows/` directory
- `openwalletvn/evals` repo created externally

---

## Part 1 - Migrate test cases to JSON files

### Files to create

```
scripts/eval-cases/
  happy-path-list-banks.json
  happy-path-recommend-cashback.json
  happy-path-compare-two-cards.json
  happy-path-card-fee-inquiry.json
  out-of-scope-gold-price.json
  out-of-scope-stock-market.json
  vague-query-best-card.json
  hallucination-guard-fake-card.json
```

### JSON schema per test case

```json
{
  "id": "happy-path-list-banks",
  "name": "happy-path: list banks",
  "description": "Model should name at least one known Vietnamese bank",
  "message": "Có những ngân hàng nào phát hành thẻ tín dụng tại Việt Nam?",
  "expect": {
    "contains": null,
    "notContains": null,
    "customDescription": "Response contains 'vietcombank', 'techcombank', or 'acb' (case-insensitive)"
  },
  "tags": ["happy-path"]
}
```

Note: `custom` functions cannot live in JSON. Replace with `customDescription` string. The harness re-implements the logic in code keyed by `id`. Keep a `customChecks` map in harness for IDs that need predicate logic.

### Changes to `scripts/eval-chat.ts`

- Remove `TEST_CASES` array
- Add `loadTestCases()` - `fs.readdirSync('scripts/eval-cases/')`, parse each JSON, return `EvalCase[]`
- `customChecks` map: `Record<string, (text: string) => boolean>` - port all 8 `custom` lambdas keyed by `id`
- On startup: merge loaded JSON with `customChecks` to reconstruct full `EvalCase` objects

---

## Part 2 - Eval harness upgrade

### New env vars required

| Var | Purpose |
|-----|---------|
| `GITHUB_TOKEN` | Push JSONL to evals repo |
| `EVALS_REPO` | `openwalletvn/evals` (or hardcode) |
| `GROQ_API_KEY` | Already exists - reuse for judge |
| `EVAL_CHAT_MODEL` | Already exists |
| `EVAL_JUDGE_MODEL` | Groq model for judge (e.g. `openai/gpt-oss-120b`) |

### Prompt version

```ts
import { execSync } from 'node:child_process';

function getPromptVersion(): string {
  try {
    return execSync('git log -1 --format=%H -- lib/chat/system-prompt.ts')
      .toString().trim();
  } catch {
    return 'unknown';
  }
}
```

### LLM judge call (Groq)

After getting chat response, call Groq with:

```
System: You are an eval judge for an AI chat assistant.
User: 
Test case: {tc.name}
User message: {tc.message}
Assistant response: {response}

Score this response 1-100.
- 100: perfect, accurate, on-topic, helpful
- 50: partially correct or partially off-topic
- 1: wrong, hallucinated, or refused valid query

Respond with valid JSON only:
{"score": <number>, "reasoning": "<one sentence>"}
```

Parse score + reasoning. Judge pass threshold: score >= 60.

### JSONL entry shape

```ts
interface EvalResult {
  run_id: string;          // uuid or `${timestamp}-${shortHash}`
  prompt_version: string;  // git hash of system-prompt.ts
  model: string;           // EVAL_CHAT_MODEL
  EVAL_JUDGE_MODEL: string;     // EVAL_JUDGE_MODEL
  test_id: string;
  input: string;
  response: string;
  rule_pass: boolean;      // existing contains/custom check
  score: number;           // LLM judge 1-100
  pass: boolean;           // rule_pass && score >= 60
  judge_reasoning: string;
  latency_ms: number;
  timestamp: string;       // ISO
}
```

One JSONL file per run: `results/YYYY-MM-DD/run-{run_id}.jsonl`

### GitHub push

After all test cases complete:

```ts
async function pushToEvalsRepo(runId: string, lines: string[]) {
  const filename = `results/${today}/run-${runId}.jsonl`;
  const content = Buffer.from(lines.join('\n') + '\n').toString('base64');
  
  // GET sha if file exists (for update), then PUT
  await fetch(`https://api.github.com/repos/openwalletvn/evals/contents/${filename}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `eval run ${runId}`,
      content,
    }),
  });
}
```

### Exit behavior

- Still `process.exit(1)` if any `pass === false` (rule or score)
- Print summary table: name | score | pass | reasoning snippet

---

## Part 3 - Admin UI (`admin/ui/`)

### Setup

New Vite + React + TypeScript project at `admin/ui/`. Add to root `package.json`:

```json
"admin:ui": "vite --config admin/ui/vite.config.ts",
"admin:ui:build": "vite build --config admin/ui/vite.config.ts"
```

Or run standalone with `pnpm --filter admin-ui dev`.

Serve built output from `admin/server.ts`:
```ts
app.use('/ui', express.static(path.join(ADMIN_DIR, 'ui/dist')));
```

### Routes in admin UI

- `/` - existing blog post manager (keep as-is, just wrap in React router)
- `/evals` - new evals route

### `/evals` page - components

**RunList** - fetches runs from GitHub API:
```
GET https://api.github.com/repos/openwalletvn/evals/contents/results/{date}
```
Displays: run_id, timestamp, model, prompt_version (short hash), pass rate %, avg score.

**RunDetail** - per-run breakdown:
- Fetch JSONL file content via GitHub API
- Parse lines → `EvalResult[]`
- Table: test_id | score | pass | input (truncated) | response (truncated) | judge_reasoning

**PromptCompare** - diff two runs:
- Select run A and run B (dropdowns)
- Table: test_id | score_A | score_B | delta | pass_A | pass_B
- Color delta: green if improved, red if regressed

**TriggerButton** - only shown when `window.location.hostname === 'localhost'`:
```ts
await fetch('http://localhost:3004/api/evals/trigger', { method: 'POST' });
```

### New Express endpoint

```ts
// admin/server.ts
import { spawn } from 'node:child_process';

app.post('/api/evals/trigger', (_req, res) => {
  const proc = spawn('npx', ['tsx', 'scripts/eval-chat.ts'], {
    cwd: CWD,
    env: process.env,
    stdio: 'pipe',
  });
  res.json({ ok: true, message: 'Eval started' });
  // Log stdout/stderr to console; client polls run list to see result appear
});
```

### GitHub API calls from UI

All reads via `https://api.github.com/repos/openwalletvn/evals/...`. No auth needed if repo is public. Cache responses in `useMemo` or simple module-level cache keyed by URL.

---

## Part 4 - GitHub Actions

### `.github/workflows/eval-run.yml`

```yaml
name: Eval Run

on:
  pull_request:
  workflow_dispatch:
    inputs:
      chat_url:
        description: 'Chat endpoint URL'
        required: false
        default: 'https://openwallet.vn/api/chat'

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: npx tsx scripts/eval-chat.ts
        env:
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
          EVAL_CHAT_MODEL: ${{ vars.EVAL_CHAT_MODEL || 'llama-3.3-70b-versatile' }}
          EVAL_JUDGE_MODEL: ${{ vars.EVAL_JUDGE_MODEL || 'llama-3.3-70b-versatile' }}
          CHAT_URL: ${{ inputs.chat_url || 'https://openwallet.vn/api/chat' }}
          GITHUB_TOKEN: ${{ secrets.EVALS_GITHUB_TOKEN }}
```

Note: use `EVALS_GITHUB_TOKEN` (PAT with `contents:write` on `openwalletvn/evals`) - not the default `GITHUB_TOKEN` which only has access to the current repo.

### `.github/workflows/evals-site.yml`

```yaml
name: Deploy Evals Site

on:
  push:
    branches: [main]
    paths:
      - 'admin/ui/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm admin:ui:build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy admin/ui/dist --project-name=openwallet-evals
```

---

## Part 5 - `openwalletvn/evals` repo

**Status: repo created.** Expected structure:

```
openwalletvn/evals/
  README.md
  results/
    2026-05-22/
      run-abc123.jsonl
    ...
```

No application code. Pure data store.

**Pending:** PAT with `contents:write` on `openwalletvn/evals` - add as `EVALS_GITHUB_TOKEN` secret in `openwalletvn/web` repo settings once provided. Same var used in eval script env and CI workflow.

---

## Implementation order

1. **Part 1** - migrate test cases to JSON files, update harness loader
2. **Part 2** - add prompt version, LLM judge, JSONL writer, GitHub push
3. **Part 3 (server)** - add `/api/evals/trigger` to `admin/server.ts`
4. **Part 3 (UI)** - scaffold `admin/ui/` Vite+React, build `/evals` route
5. **Part 4** - create workflow files
6. **Wire PAT** - once provided: set `EVALS_GITHUB_TOKEN` in `.env.local` + GitHub repo secrets
7. **Test locally** - run `npx tsx scripts/eval-chat.ts`, verify JSONL pushed to evals repo
8. **Test UI** - `pnpm admin` + `pnpm admin:ui`, open `localhost:3004/ui/evals`

---

## Key constraints checklist

- [ ] Groq for both chat responses AND LLM judge (same `GROQ_API_KEY`)
- [ ] GitHub API for all evals repo I/O (no `git clone`)
- [ ] `window.location.hostname === 'localhost'` gates trigger button and test case editor
- [ ] Prompt version = `git log -1 --format=%H -- lib/chat/system-prompt.ts`
- [ ] One eval script, same code path local and CI (`CHAT_URL` env var switches target)
- [ ] `evals-site.yml` deploys to `evals.openwallet.vn` via Cloudflare Pages
- [ ] `EVALS_GITHUB_TOKEN` - PAT with `contents:write` on `openwalletvn/evals` (pending)
