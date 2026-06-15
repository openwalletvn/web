# OpenWallet — Web Codebase

## Purpose of this file

Phuc is using this codebase as a **learning lab** — mastering React fundamentals through his own production code. Goal: go from "prompt the code and it runs" → understand what was built and why. Interview prep context: CloudThinker technical interview 2026-06-12 14:00.

**How to use this session:** Explain concepts using actual code from this repo. When Phuc asks "what is X", show him where X lives in this codebase and why it was done that way.

---

## Codebase overview

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Zustand (via assistant-ui), Dexie (IndexedDB), Vercel AI SDK, assistant-ui, Langfuse, MCP

**What this app does:** Vietnamese credit card comparison platform. Cards, ranking, AI chat (Owie), card battle, blog.

---

## Directory map

```
app/                  Next.js app router
  (blog)/             Blog routes
  (chat)/             Owie AI chat routes
  (marketing)/        Landing, cards, compare pages
  api/                API routes (Next.js server)

components/
  assistant-ui/       Chat UI components (assistant-ui lib)
  cards/              Card display components
  chat/               Chat-specific UI
  compare/            Card Battle / comparison UI
  match/              Card Match ranking UI
  ow-ui/              Internal design system components
  ui/                 shadcn/ui base components
  layout/             Header, footer, nav
  shared/             Shared across features

lib/
  card-model.ts       Card data types/schema
  card-ranker.ts      Ranking algorithm (core logic)
  intent-model.ts     Intent/scenario types
  db.ts               Dexie database setup
  langfuse.ts         Langfuse tracing
  tools.ts            MCP tool definitions
  api.ts              API client

hooks/
  use-wallet-catalog.ts   Card catalog hook
  use-mobile.ts           Responsive hook
```

---

## Key architecture decisions

- **Zustand not used directly** — assistant-ui manages its own state internally. Phuc uses Vercel AI SDK `useChat` hook for the chat state.
- **Dexie (IndexedDB)** — client-side persistence for wallet, recent searches, recent compares. No server DB for user data.
- **MCP on Cloudflare Workers** — migrated from Next.js server after RAM contention. MCP server is a separate repo/deployment.
- **assistant-ui** — wraps Vercel AI SDK. Provides ThreadList, Thread, Composer, Message components. Phuc integrated it but the internals are the library's concern.
- **Route groups** — `(blog)`, `(chat)`, `(marketing)` are Next.js route groups. Parentheses = no URL segment, just layout grouping.

---

## Learning goals for Phuc

1. **Understand state flow** — where does data come from, how does it move through components, where does it live
2. **React fundamentals via real code** — controlled components, custom hooks, context, composition
3. **Explain the codebase** — be able to whiteboard OpenWallet architecture in an interview
4. **Identify the "codebase looks like shit" parts** — what grew organically, what should be refactored, and how to articulate that

---

## How to explore

- "Explain how card ranking works" → read `lib/card-ranker.ts`
- "How does the chat state work" → read `app/(chat)/` + `components/assistant-ui/`
- "Where is Dexie used" → read `lib/db.ts` + `lib/app-db.ts`
- "Show me a custom hook" → read `hooks/use-wallet-catalog.ts`
- "How does MCP connect" → read `lib/tools.ts`

---

## Interview context

Phuc built this solo. Key talking points:
- Schema design was the hard part — Vietnamese credit card rules are wildly inconsistent
- Card Match ranks by intent scenarios, not static filters
- Owie chat queries card DB exclusively via MCP (13 tools) — no hallucinated data
- Migrated API + MCP to Cloudflare Workers for RAM contention
- 500+ Vitest test cases — data changes cascade to ranking test failures
- Langfuse: tracing per chat, eval cases, system prompt managed via dashboard
