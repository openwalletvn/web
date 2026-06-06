# Context Display Token Usage Fix

## Problem
The `ContextDisplay.Ring` component in the chat UI consistently showed 0% token usage, even when streaming responses consumed tokens.

## Root Cause Analysis
There were two issues that caused this:

### 1. Incorrect Route Handler (Fixed in commit 5fc58ea)
The `/app/api/chat/route.ts` was incorrectly placing token usage data on the `finish-step` part instead of the `finish` part:

```ts
// BROKEN (after commit 5fc58ea)
if (part.type === 'finish-step') {
  return {
    usage: part.usage,        // LanguageModelUsage from stream
    modelId: part.response.modelId,
  };
}
```

However, the AI SDK's `toUIMessageStream` function **does not forward** `finish-step` messageMetadata to the client wire - it only forwards `finish` and `message-metadata` chunks. This meant the `usage` data never reached the client.

### 2. Library Bug in @assistant-ui/core
Even after fixing the route to put usage on `finish`, the `ContextDisplay.Ring` still showed 0 due to a bug in `@assistant-ui/core`'s `fromThreadMessageLike` function.

This function reconstructs assistant message metadata when converting from `UIMessage` to `ThreadMessage` for storage in the assistant-ui store. It only preserves a **hardcoded list** of metadata fields:
- `unstable_state`
- `unstable_annotations` 
- `unstable_data`
- `custom`
- `steps`
- `timing`
- `submittedFeedback`

**Crucially, it does NOT preserve a top-level `usage` field.** So even when `message.metadata.usage` arrived correctly from the stream, it was dropped during conversion to the internal thread message format.

The `useThreadTokenUsage` hook (used by `ContextDisplay.Ring`) reads usage from:
1. `message.metadata.usage` (top-level) - always undefined due to the bug
2. `message.metadata.custom.usage` (fallback) - preserved because `custom` is in the whitelist
3. `message.metadata.steps[].usage` (not applicable here)

## Solution
Place the usage data inside `metadata.custom` so it survives the `fromThreadMessageLike` conversion:

```ts
// FIXED
if (part.type === 'finish') return { custom: { usage: part.totalUsage } };
if (part.type === 'finish-step') return { modelId: part.response.modelId };
```

The `useThreadTokenUsage` hook will then find the usage data via the `legacyUsage` path (checking `metadata.custom.usage`) and return correct token counts.

## Verification
After this fix:
1. Stream finishes with `finish` chunk containing `{ custom: { usage: { inputTokens, outputTokens, totalTokens } } }`
2. `AbstractChat` merges this into `state.message.metadata`
3. `useChat` passes message to assistant-ui store
4. `fromThreadMessageLike` preserves `metadata.custom` (including `usage`)
5. `useThreadTokenUsage` reads `metadata.custom.usage` → normalized → returned
6. `ContextDisplay.Ring` displays correct percentage

## Files Changed
- `/app/api/chat/route.ts` - moved usage into `custom` wrapper

## Related Commits
- Regressed by: `5fc58ea fix(chat): fix finish-step metadata shape, add messageMetadataSchema`
- Root fix: moving usage into `custom` field