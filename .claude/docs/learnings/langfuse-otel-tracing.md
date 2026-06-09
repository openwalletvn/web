# Langfuse + Vercel AI SDK: OTEL Tracing

## The two approaches

### Approach A: OTEL (canonical, current)
`instrumentation.ts` → `NodeTracerProvider` + `LangfuseSpanProcessor` → `observe()` wrapper → `experimental_telemetry: { isEnabled: true }` on `streamText`.

### Approach B: Manual HTTP (old, removed)
Raw `fetch()` to `/api/public/ingestion`. Was in codebase from early features, added ad-hoc, no consistent pattern. Replaced by Approach A.

**Always use A.** B looks simple but misses: auto token counts, span hierarchy, tool call spans, step-level tracing — all of which OTEL gives for free via `experimental_telemetry`.

---

## Setup: instrumentation.ts

Must use `NodeTracerProvider` directly. Do NOT use `@vercel/otel` — Langfuse docs explicitly say to avoid it.

```ts
import { LangfuseSpanProcessor } from '@langfuse/otel';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { resourceFromAttributes } from '@opentelemetry/resources'; // v2 API — NOT `new Resource({})`

export const langfuseSpanProcessor = new LangfuseSpanProcessor();

const tracerProvider = new NodeTracerProvider({
    resource: resourceFromAttributes({
        'service.name': process.env.VERCEL_ENV ?? 'development',
    }),
    spanProcessors: [langfuseSpanProcessor],
});

tracerProvider.register();
```

**`@opentelemetry/resources` v2 breaking change:** `new Resource({})` removed, replaced by `resourceFromAttributes({})`.

**`VERCEL_ENV`** = `production` / `preview` / `development` — use as `service.name` to filter traces by environment in Langfuse UI. No extra env var needed.

Export `langfuseSpanProcessor` from here so route can call `forceFlush()` via `after()`.

---

## Setup: route handler

```ts
import { observe, propagateAttributes, setActiveTraceIO, getActiveTraceId } from '@langfuse/tracing';
import { trace } from '@opentelemetry/api';
import { langfuseSpanProcessor } from '@/instrumentation';
import { after } from 'next/server';

const handler = async (req: Request) => {
    // set input before propagateAttributes
    setActiveTraceIO({ input: lastUserMessage });

    return await propagateAttributes(
        {
            traceName: 'chat',
            sessionId: body.sessionId,
            userId: body.userId,
            tags: ['web-chat'],
            // all metadata values must be string (propagateAttributes type constraint)
            metadata: { model, ip, promptVersion: String(promptVersion), messageCount: String(messageCount) },
        },
        async () => {
            const traceId = getActiveTraceId(); // capture before streamText

            const result = streamText({
                model: openrouter(model),
                messages,
                experimental_telemetry: { isEnabled: true }, // auto-captures tokens, steps, tool calls
                onFinish: async ({ text }) => {
                    setActiveTraceIO({ output: text });
                    trace.getActiveSpan()?.end(); // must end span manually (endOnExit: false)
                },
                onError: async () => {
                    trace.getActiveSpan()?.end();
                },
            });

            result.consumeStream(); // no await — ensures onFinish fires if client disconnects

            after(async () => await langfuseSpanProcessor.forceFlush()); // required for serverless

            return result.toUIMessageStreamResponse({
                messageMetadata: ({ part }) => {
                    if (part.type === 'finish') return { custom: { traceId } }; // expose traceId to frontend
                    return undefined;
                },
            });
        }
    );
};

export const POST = observe(handler, {
    name: 'handle-chat-message',
    endOnExit: false, // keep span open until stream finishes (onFinish calls span.end())
});
```

**`endOnExit: false`** is critical — without it the span closes before `onFinish` fires and output is never recorded.

**`after()` + `forceFlush()`** is required in serverless (Vercel functions). Without it, the function exits before spans are flushed to Langfuse.

**`metadata` values must all be strings** — `propagateAttributes` types `metadata` as `Record<string, string>`. Pass numbers with `String()`.

---

## traceId → frontend → feedback

`getActiveTraceId()` captures the active trace ID inside `propagateAttributes()`. Inject into `messageMetadata` on the `finish` part → flows to `message.metadata.custom.traceId` on the client.

Read in `FeedbackAdapter`:

```ts
adapters: {
    feedback: {
        submit: async ({ type, message }) => {
            const traceId = (message.metadata as { custom?: { traceId?: string } })?.custom?.traceId;
            if (!traceId) return; // silently skip if no traceId (e.g. old messages)
            await fetch('/api/chat/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ traceId, value: type === 'positive' ? 1 : 0 }),
            });
        },
    },
},
```

**Never expose `LANGFUSE_SECRET_KEY` to frontend.** Use a server proxy route (`/api/chat/feedback`) that calls `POST /api/public/scores`.

---

## Posting scores (feedback)

```ts
// POST /api/public/scores — NOT batch ingestion
// Batch ingestion silently accepts scores but never stores them
await fetch(`${baseUrl}/api/public/scores`, {
    method: 'POST',
    headers: { Authorization: basicAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
        traceId,
        name: 'user-feedback',
        value, // 0 or 1
        dataType: 'NUMERIC',
    }),
});
```

---

## What gets auto-tracked by OTEL

When `experimental_telemetry: { isEnabled: true }` is set on `streamText`, Langfuse auto-captures:
- Token counts (input/output/total)
- Model name
- Latency
- Tool calls (name + args + result per step)
- Step count
- Finish reason

Manual additions via `propagateAttributes` + `setActiveTraceIO`:
- `sessionId`, `userId`, `tags`
- `metadata.model`, `metadata.ip`, `metadata.promptVersion`, `metadata.messageCount`
- `input` (last user message text)
- `output` (full assistant response)

User feedback:
- Score name: `user-feedback`, value `1` (positive) or `0` (negative), dataType `NUMERIC`

---

## Packages

```
@langfuse/otel         — LangfuseSpanProcessor
@langfuse/tracing      — observe(), propagateAttributes(), setActiveTraceIO(), getActiveTraceId()
@opentelemetry/api     — trace.getActiveSpan()
@opentelemetry/sdk-trace-node  — NodeTracerProvider
@opentelemetry/resources       — resourceFromAttributes (v2)
```
