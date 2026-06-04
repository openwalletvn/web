# Chat Feature: Groq + assistant-ui + AI SDK v6

## Architecture

```
/chat (page.tsx)
  └── ChatPageClient (client, 'use client')
        ├── useChatRuntime({ transport: AssistantChatTransport({ api: '/api/chat' }) })
        ├── localStorage sync (onFinish callback, debounced 500ms)
        └── <AssistantRuntimeProvider> → <Thread />

/api/chat/route.ts (server)
  ├── IP rate limit (in-memory Map, 20 req/min → 429)
  ├── convertToModelMessages(uiMessages.slice(-12))
  └── streamText(groq(EVAL_CHAT_MODEL), tools, stopWhen: stepCountIs(5))
```

## AI SDK v6 gotchas

### UIMessage vs ModelMessage
Client sends `UIMessage[]` (has `parts`, `metadata`, `id`). `streamText` needs `ModelMessage[]`.
**Always** convert at the route boundary:
```ts
const messages = await convertToModelMessages(uiMessages.slice(-12));
```

### tool() API changed
- v4/v5: `parameters: z.object({...})`
- v6: `inputSchema: z.object({...})`

### maxSteps removed
- v4/v5: `maxSteps: 5`
- v6: `stopWhen: stepCountIs(5)` (import `stepCountIs` from `ai`)

### Streaming response method
- v4/v5: `result.toDataStreamResponse()`
- v6: `result.toUIMessageStreamResponse()`

## assistant-ui setup

`useChatRuntime()` defaults to `AssistantChatTransport` at `/api/chat`.
To use a custom URL, pass `transport` explicitly — there is no `api` shorthand:
```ts
const runtime = useChatRuntime({
  transport: new AssistantChatTransport({ api: '/api/chat' }),
  messages: initialMessages,   // UIMessage[] for pre-loading history
  onFinish: ({ messages }) => save(messages),
});
```

Install components via: `npx assistant-ui@latest add thread --path components/assistant-ui`
(Not `npx assistant-ui@latest init` alone — files end up missing without `--path`.)

## localStorage history pattern

```ts
const [initialMessages] = useState<UIMessage[]>(() => {
  try { return JSON.parse(localStorage.getItem('ow-chat-history') ?? '[]'); }
  catch { return []; }
});
// Save on every LLM response via onFinish
```

`onFinish` receives `{ messages: UIMessage[] }` — save the full array, not just the new message.

## Rate limiting

In-memory Map works for single-process dev/prod. For multi-instance production, replace with Upstash Redis (phase 2). Current: 20 req/min per IP, 60s window.

## Tools

All 5 tools use `apiFetch()` — never raw `fetch()`.
`rankCardsForSpend` calls `rankCards()` from `lib/card-ranker.ts`.
Strip heavy fields before returning to LLM (saves tokens):
```ts
const { image, sources, card_network_data, contactless_methods_data, co_brand_data, bank_data, ...rest } = card;
```

## Eval harness

```bash
# Requires dev server running on :3000
npx tsx scripts/eval-chat.ts
# Override URL:
CHAT_URL=http://localhost:3000/api/chat npx tsx scripts/eval-chat.ts
```

8 test cases: happy path × 4, out-of-scope × 2, vague × 1, hallucination guard × 1.
