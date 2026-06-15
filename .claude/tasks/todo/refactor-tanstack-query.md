# Refactor: Add TanStack Query for client-side data caching

## Goal

Replace manual `useState` + `useEffect` + `fetch` patterns with TanStack Query.
Cards/banks/personas/intents fetched once per session, shared across all routes via cache.

## Install

```bash
pnpm add @tanstack/react-query
```

Add `QueryClientProvider` to root layout (client wrapper).

## Targets

### 1. `hooks/use-wallet-catalog.ts`
Manual fetch of banks + cards per walletCard. Replace with `useQuery`.

### 2. `components/match/card-match-finder.tsx` (lines 99-121)
Manual fetch to `/api/ranking` with manual loading state. Replace with `useQuery` or `useMutation`.

### 3. Any future client-side API calls
Default to `useQuery` — never raw `fetch` + `useState` in client components.

## Query keys convention

```ts
['cards']               // all cards
['banks']               // all banks
['personas']            // all personas
['intents']             // all intents
['ranking', persona, rankBy, spendStepIdx]  // card match results
```

## Cache strategy

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,  // 1hr — matches ISR revalidate
      gcTime: 24 * 60 * 60 * 1000, // 24hr in memory
    },
  },
})
```

## Two-layer cache

```
CDN (ISR revalidate=3600)     → HTML pre-rendered, fast first load, SEO
TanStack Query (staleTime=1hr) → client data cache, zero refetch on navigation
```

## Notes

- Marketing pages stay as Server Components — ISR handles them, no TanStack needed
- TanStack only for `'use client'` components that fetch API data
- Wallet app (frozen) is the main candidate when revived
