# State Management — Core Concepts

Learned through OpenWallet codebase exploration.

---

## The full map

```
Where data comes from     →  tool to use
──────────────────────────────────────────
API / server              →  TanStack Query
Global UI (shared)        →  Zustand or Jotai
Local UI (one component)  →  useState / useReducer
Complex local transitions →  useReducer
Side effects              →  useEffect
Shared static data        →  Context
Derived from other state  →  useMemo or Jotai derived atoms
```

---

## useState

- Any value type (primitive, object, array)
- Local to one component
- Re-renders when reference changes (not value — must return new ref for objects/arrays)
- Use for: toggle, active tab, form input, any UI state that belongs to one component

```ts
const [activePersona, setActivePersona] = useState<string | null>(null)
setActivePersona('credit')  // triggers re-render
```

---

## useEffect

Not for storing state — for reacting to state changes.

```
[] empty deps     → run once on mount
[x, y] deps       → run when x or y changes
return () => ...  → cleanup (cancel timers, remove listeners)
```

Real example in codebase: `card-match-finder.tsx` syncs URL + localStorage when state changes.

---

## useReducer

Same as useState but for complex transitions — multiple related values that change together.

```ts
dispatch({ type: 'SET_TYPE', payload: 'credit' })
// reducer handles: set type + auto-set sortBy = 'fee_asc' — business rule in one place
```

- Centralized transition logic
- Impossible states prevented (can't forget to set one of 6 related values)
- Pure function — testable without React
- Redux uses same pattern but globally

---

## Context

Broadcast read-only data down the tree without prop drilling.

```
createContext → Provider wraps tree → useContext reads anywhere inside
```

Re-renders ALL consumers when value changes — don't use for frequently-changing state.
Good for: DB instance, theme, config, static maps.

Real example: `lib/intent-map-context.tsx` — passes IntentMap built once at page load.
Real example: `providers/wallet-db-provider.tsx` — passes Dexie DB instance + wallet.

---

## TanStack Query (React Query)

Client-side cache for server/API data.

```ts
const { data, isLoading, error } = useQuery({
  queryKey: ['cards'],          // cache key
  queryFn: fetchCards,
  staleTime: 60 * 60 * 1000,   // fresh for 1hr
})
```

- Same queryKey from any component → one request, shared cache
- Automatic loading/error states
- Background refetch when stale
- Deduplication

Current codebase does this manually with useState + useEffect in `use-wallet-catalog.ts` — TanStack Query refactor tracked in `.claude/tasks/todo/refactor-tanstack-query.md`.

---

## Zustand

Global UI state. Store lives outside React.

```ts
const useStore = create((set) => ({
  filters: { type: null, bank: null },
  setType: (type) => set(s => ({ filters: { ...s.filters, type } })),
}))

// Fine-grained re-render via selector
const type = useStore(s => s.filters.type)  // only re-renders when type changes
```

- Factory pattern for scoped stores: `makeXStore()` → pass via Context → children subscribe
- assistant-ui uses this for per-thread state (`makeThreadViewportStore`)
- Lives outside React → possible tearing in concurrent mode (rare edge case)

---

## Jotai

Global UI state as independent atoms. Lives inside React.

```ts
const darkModeAtom = atom(false)
const [darkMode, setDarkMode] = useAtom(darkModeAtom)
```

- Independence comes from splitting atoms, not from Jotai itself
- Object in one atom = whole object re-renders (same as useState)
- Async atoms work with Suspense natively
- Concurrent-mode safe (inside React = React controls lifecycle)
- `atomFamily` for scoped atoms — awkward vs Zustand factory pattern

**When Jotai wins over Zustand:** Suspense-native async, concurrent mode safety, many truly independent atoms.

---

## Redux

useReducer pattern + global store + DevTools + middleware.

```
dispatch → reducer → global store → all subscribers re-render
```

Same as DOM `dispatchEvent` / `addEventListener` but:
- Only reducer can change state (predictable)
- Full action history (time-travel debugging)
- Strict conventions for large teams

Modern consensus: overkill for solo/small teams. Use Zustand instead.

---

## ISR vs Client Cache

```
ISR (revalidate=3600)         CDN edge    all users    survives refresh
TanStack Query (staleTime)    browser RAM per user     gone on refresh
```

Two layers, different purposes:
- ISR: CDN serves cached HTML → fast first load, SEO, zero API calls for most requests
- TanStack Query: prevents refetch on client navigation within a session

---

## Immutation rule

React uses reference equality (`oldState === newState`) to detect changes.

```ts
// Mutation — same reference → React skips re-render ❌
arr.push(item); setState(arr)

// Immutation — new reference → React re-renders ✅
setState([...arr, item])
setState({ ...obj, name: 'new' })
```

Always return new reference for objects and arrays. Immer library lets you write mutation syntax that produces immutable result under the hood.

---

## Suspense + Concurrent Mode

**Suspense** — component signals "not ready" → React shows fallback automatically. Removes manual isLoading from components.

**Concurrent Mode** — React 18+. Render is interruptible. User interactions can pause renders, keeping UI responsive.

In this codebase: `card-match-finder.tsx` wraps in `<Suspense>` because `useSearchParams()` requires a Suspense boundary in Next.js App Router.

---

## Decision tree

```
Data from API?
  → TanStack Query

Shared across components?
  Static/rarely changes → Context
  Frequently changes, related state → Zustand
  Many independent pieces, Suspense needed → Jotai
  Large team, audit trail → Redux

One component only?
  Simple → useState
  Multiple related values that change together → useReducer

Reacting to state change?
  → useEffect
```
