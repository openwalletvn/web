# Chat (Owie)

**Status: LIVE.** Public at `/owie-chat` (landing) + `/chat` (full app). No auth required, free.
Header toggle button (`ChatToggleButton`) still hidden — UX decision, not readiness gate.

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

## Route handler (`app/api/chat/route.ts`)

- Model: `CHAT_MODEL` env var, fallback `DEFAULT_MODEL`
- MCP: `OPENWALLET_MCP_URL` (default `http://localhost:8001`) + `OPENWALLET_MCP_KEY`
- Rate limit: 20 req/min per IP, in-memory Map - replace with Upstash Redis for multi-instance prod
- `result.consumeStream()` without await - ensures `onFinish` fires even if client disconnects

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
`onFinish` requires stream fully consumed. Browser disconnects kill the handler before `onFinish` fires.
Fix: `result.consumeStream()` (no await) before returning response.

```ts
result.consumeStream(); // no await - ensures onFinish fires even if client disconnects
return result.toUIMessageStreamResponse();
```

What does NOT work:
- `after(() => sendChatTrace(...))` inside `onFinish` - `after()` must register synchronously in route scope
- `await after(result.consumeStream())` - type error + wrong behavior

## assistant-ui setup

```ts
const runtime = useChatRuntime({
  transport: new AssistantChatTransport({ api: '/api/chat' }),
  messages: initialMessages,   // UIMessage[] for pre-loading history
  onFinish: ({ messages }) => save(messages),
});
```

Install components: `npx assistant-ui@latest add thread --path components/assistant-ui`
(Not `npx assistant-ui@latest init` alone - files end up missing without `--path`.)

## Local dev logging

Dev only (`NODE_ENV=development`). Writes to `logs/chat-<sessionId>.log` (gitignored).
One JSON line per AI response (NDJSON). Each session gets its own file - same session appends, new session = new file.

### Log entry shape
```json
{
  "ts": "2026-06-05T04:58:30.278Z",
  "sessionId": "d4810ef7-...",
  "userId": "keen-beaver-4431",
  "ip": "::1",
  "model": "nvidia/nemotron-...",
  "messages": [...],
  "steps": [
    {
      "text": "...",
      "toolCalls": [{ "toolName": "rank-cards-for-spend", "args": {} }],
      "toolResults": [{ "toolName": "rank-cards-for-spend", "result": {} }]
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
pnpm chatlog                          # stream all sessions (pretty via jq)
pnpm chatlog:id <sessionId>           # stream one session
tail -f logs/chat-*.log | jq .        # same as pnpm chatlog
cat logs/chat-<id>.log | jq .         # read full session without streaming
```

Use logs as eval harness input - full messages + tool calls + tool results, no Langfuse needed.

## Observability (Langfuse)

All observability uses Langfuse direct HTTP ingestion - no SDK (JS SDK silently fails in CF Workers, GitHub issue #11984).

**File:** `lib/langfuse.ts`

- `fetchSystemPrompt()` - fetches `chat-system-prompt?label=production`, 60s in-memory cache, falls back to hardcoded `SYSTEM_PROMPT` on error
- `sendChatTrace()` - sends trace with input/output/model/tokens/latency/finishReason/steps/promptVersion

**Trace fields:**

| Field | Source |
|-------|--------|
| `input` | Last user message text |
| `output` | Full assistant response |
| `model` | `CHAT_MODEL` / `DEFAULT_MODEL` env var |
| `tokens.input` | `usage.inputTokens` from AI SDK `onFinish` |
| `tokens.output` | `usage.outputTokens` |
| `latencyMs` | `Date.now() - startTime` |
| `finishReason` | From `onFinish` |
| `steps` | `steps.length` (tool call count) |
| `promptVersion` | From Langfuse prompt fetch |

**LLM-as-Judge evaluator** configured in Langfuse UI → Evaluators:
- Target: Live Traces, filter trace name = `chat`
- Model: Groq via OpenAI adapter
- Scores appear in Evaluation → Scores automatically

**Env vars:**
```
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

**Known quirk:** `score-create` in batch ingestion (`POST /api/public/ingestion`) silently accepted but never stored. Always use `POST /api/public/scores` for scores.

## System prompt

Lives in Langfuse UI: Prompts → `chat-system-prompt` label=`production`.
Edit in UI → new version tagged `production` → live within 60s (cache TTL).
Hardcoded fallback in `lib/chat/system-prompt.ts` used when Langfuse unreachable.

## MCP tools (13 registered)

Local dev: falls back to `http://localhost:8001`. Prod: `OPENWALLET_MCP_URL` env var.

| Tool | Used by |
|---|---|
| `rank-cards-for-spend` | A1 A2 A3 A4 |
| `find-card` | B1 B2 C1 C2 C3 |
| `find-bank` | A5 C4 |
| `get-card-detail` | C1 |
| `compare-cards` | C2 |
| `related-cards` | C3 |
| `cashback-card` | B1 B2 |
| `list-merchants` | A2 |
| `list-personas` | A4 |
| `search-cards` | A5 C4 |
| `list-intents` | LLM routing / grounding |
| `list-intent-groups` | LLM routing / grounding |
| `list-banks` | disambiguation |

## Core questions (product scope)

### Cat A: Card discovery (no cards yet)
| # | User question | Tools |
|---|---|---|
| A1 | "Thẻ nào phù hợp chi tiêu của tôi?" | `rank-cards-for-spend` |
| A2 | "Thẻ nào tốt cho Shopee / Grab / TikTok Shop?" | `list-merchants` → `rank-cards-for-spend` |
| A3 | "Thẻ không phí thường niên tốt nhất?" | `rank-cards-for-spend` (constraint) |
| A4 | "Tôi hay đi du lịch, thẻ nào?" | `list-personas` → `rank-cards-for-spend` |
| A5 | "VCB có những thẻ gì?" | `find-bank` → `search-cards` |

### Cat B: Spend optimization (user has cards)
| # | User question | Tools |
|---|---|---|
| B1 | "Tôi có thẻ A và B, nên dùng thẻ nào mua xăng?" | `find-card` × N → `cashback-card` × N |
| B2 | "Thẻ X hoàn tiền bao nhiêu cho Shopee?" | `find-card` → `cashback-card` |

### Cat C: Card research
| # | User question | Tools |
|---|---|---|
| C1 | "Phí thường niên thẻ X?" | `find-card` → `get-card-detail` |
| C2 | "So sánh thẻ A vs B" | `find-card` × 2 → `compare-cards` |
| C3 | "Thẻ nào tương tự thẻ X?" | `find-card` → `related-cards` |
| C4 | "Techcom có thẻ gì?" | `find-bank` → `search-cards` |

## Eval harness

```bash
pnpm eval   # runs scripts/eval-chat.ts, requires dev server on :3000
# Override URL:
CHAT_URL=http://localhost:3000/api/chat pnpm eval
```

Or use `logs/chat-<sessionId>.log` directly as eval input - contains full messages + steps + tool calls/results.

**Eval cases needed** (pass ≥85% before moving on):

Cat A: `A1-spend-basic`, `A1-spend-multi`, `A2-merchant-shopee`, `A2-merchant-tiktok`, `A3-no-fee`, `A4-persona-traveler`, `A4-persona-commuter`, `A5-bank-browse`

Cat B: `B1-multi-card-optimize`, `B2-cashback-query`

Cat C: `C1-card-fees`, `C2-compare`, `C3-related`, `C4-bank-cards`

Guards: `guard-invented-rate`, `guard-nonexistent-bank`, `guard-ambiguous`

**Harness improvements needed:**
- Add `pageContext` field to eval case schema
- Add `expectToolCalls` field - assert which tools were called
- Wire to CI (GitHub Actions) on push to preview/main

## Dev plan phases

**Phase 1:** Eval coverage (current)

**Phase 2:** System prompt iteration - known gaps:
- No instruction: use `list-merchants` when user mentions brand name
- No instruction: spend-profile flow → ask amounts → call `rank-cards-for-spend`
- No instruction: persona shortcut → "hay đi du lịch" → `list-personas`
- No instruction: Cat B flow → "tôi có thẻ X" → `find-card` → `cashback-card`

**Phase 3:** UI polish
- Remove debug "Copy messages" button (`ClipboardCopyIcon`) from `chat-panel.tsx:154`
- Add suggested starter prompts when thread empty
- Verify `/chat?id=` param restores conversation correctly

**Phase 4:** PageContext expansion
- `/card-battle?compare=X,Y` → `{ type: 'compare', cardIds: [...] }`
- `/the/[persona]` → `{ type: 'persona', personaSlug, personaName }`

## What NOT to do

- No wallet integration with chat
- No persistent server-side chat history - localStorage only
- No user auth - anonymous only
- No new MCP tools - all 13 justified
- Chat button stays hidden in header until explicitly requested
