# Edit Owie's system prompt

Edit `lib/chat/system-prompt.ts` then push to Langfuse as new production version.

## Invariants - NEVER change without explicit user instruction

These rules are load-bearing. Breaking them silently breaks product behavior or trust:

1. **Owie persona** - name is "Owie", role is OpenWallet.vn card advisor. Warm + professional tone.
2. **CT address** - always address user as "CT". Keep explanation when asked.
3. **Vietnamese default** - respond in Vietnamese unless user writes in another language.
4. **Tool-before-answer** - NEVER fabricate cashback rates, fees, or interest rates. Always call a tool first.
5. **Scope refusal template** - use exact Vietnamese refusal template for off-topic questions. Do not soften or remove.
6. **Card links** - only link cards via `/the/<slug>` using tool-retrieved slugs. Never invent slugs.
7. **No `#` headings** - response format rule. Only `##` and below.
8. **Tool routing logic (Cat A/B/C)** - the tool call sequences are precise. Do not collapse or reorder steps.

## Steps

### 1. Understand the change request
- What category: persona, scope, tool rules, response format, language?
- Does it conflict with any invariant above? If yes, ask for explicit confirmation before proceeding.

### 2. Edit the prompt
File: `lib/chat/system-prompt.ts` → `SYSTEM_PROMPT` const.

Prompt writing rules:
- **Persona first** - name/role/tone at top
- **Positive over negative** - "do X" beats "don't do Y" where possible
- **Concrete over vague** - add examples for new rules, not just descriptions
- **No contradictions** - new rules must not conflict with existing ones; later rule wins but inconsistently
- **Tool rules last** - LLMs read top-heavy; scope/persona matters most at top

### 3. Sync the fallback
`buildSystemPrompt()` in same file uses `SYSTEM_PROMPT` as base - no separate edit needed. But if `pageContext` injection logic changes, update the `if (pageContext.type === ...)` blocks too.

### 4. Check evals coverage
- Does the change affect any of the 13 eval test cases in `evals/`?
- If new behavior added: note it needs a new eval case (don't write it now unless asked).

### 5. Push to Langfuse
**STOP - do NOT run the push command automatically. Show the diff and ask for confirmation first.**

After editing, show the user what changed, then ask: "Push to Langfuse as version N?"

Only run after explicit user approval:
```bash
pnpm push:prompt
```
- Pushes `SYSTEM_PROMPT` const to Langfuse as new `production` version
- Live within 60s (cache TTL in `fetchSystemPrompt()`)
- Confirm output shows `✓ Pushed version N`
- **Note:** `STATIC_LISTS` (persona/merchant lists injected by `buildSystemPrompt()`) are NOT pushed - they are always injected at runtime from local constants. Langfuse only stores the base prompt text.

### 6. Verify
- Check Langfuse UI or wait 60s and test via `/chat`
- Hardcoded fallback in `lib/chat/system-prompt.ts` is the source of truth for the push script - they stay in sync automatically

## What NOT to change via this command
- `buildSystemPrompt()` function signature or `pageContext` types - that's a code change, not a prompt change
- `push-prompt.ts` script - separate concern
- Eval test cases - use eval workflow instead
