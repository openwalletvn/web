# Chat traces not appearing in Langfuse

## Problem

`onFinish` callback fires correctly in eval (Node process stays alive), but **not** in browser chat — browser closes connection after stream ends, tearing down the route handler before `sendChatTrace` completes.

## Root cause

`streamText` `onFinish` requires the stream to be fully consumed. When the browser disconnects, the server-side stream consumption stops → `onFinish` never fires.

## Fix

Call `result.consumeStream()` **without await** before returning the response. This runs the stream to completion in the background regardless of client disconnect.

```ts
result.consumeStream(); // no await — ensures onFinish fires even if client disconnects
return result.toUIMessageStreamResponse();
```

## What does NOT work

- `after(() => sendChatTrace(...))` inside `onFinish` — `after()` must be registered synchronously in route handler scope, not inside an async callback
- `await after(result.consumeStream())` — `consumeStream()` returns `PromiseLike` not `Promise`, causes type error and wrong behavior
- Direct `await sendChatTrace()` inside `onFinish` without `consumeStream()` — still gets killed on client disconnect

## Source

AI SDK docs: `content/docs/04-ai-sdk-ui/03-chatbot-message-persistence.mdx`
