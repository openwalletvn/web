# useMemo / useCallback / React.memo

---

## The problem

React re-renders component → everything inside re-runs. Same input, wasted work.

---

## useMemo — cache computed value

```ts
const pool = useMemo(() => {
  return allCards.filter(c => c.type === cardType)
}, [allCards, cardType])
// recomputes only when allCards or cardType changes
```

Chain for multi-step derivation:
```ts
const pool    = useMemo(() => allCards.filter(...), [allCards, cardType, bank])
const sorted  = useMemo(() => [...pool].sort(sortFn), [pool, sortBy])
// sorted reruns when pool changes, NOT when cardType changes (pool absorbs it)
```

---

## useCallback — cache function reference

```ts
const handleSortChange = useCallback((s: string) => {
  setSortBy(s)
}, [])
// same ref across renders, unless deps change
```

**Only purpose: stable ref so React.memo child skips re-render.**

```
useMemo      → caches return VALUE
useCallback  → caches the FUNCTION itself (= useMemo(() => fn, deps))
```

If handler never passed as prop to React.memo child → useCallback does nothing useful.

---

## React.memo — skip child re-render

```ts
const CardList = React.memo(function CardList({ cards, onSort }) {
  return <ul>...</ul>
})
// re-renders only if cards or onSort ref changes
```

**React.memo alone useless if you pass new function/object refs as props.**

---

## How they connect

```
React.memo checks reference equality (===)
  new function prop each render → always "changed" → child re-renders anyway

Fix:
  useCallback(fn, deps) → stable ref → React.memo works correctly
  useMemo(obj, deps)    → stable ref for object/array props
```

---

## Mental model

```
useMemo      → expensive derived data (filter, sort, transform large array)
useCallback  → function passed as prop to React.memo child
React.memo   → component that re-renders often but props rarely change

Not needed:
  simple values, components that always need re-render,
  handlers that never leave parent component
```

---

## Quick reference

| Pattern | Use |
|---|---|
| `useMemo(() => arr.filter(...), [deps])` | cache filtered pool |
| `useMemo(() => [...pool].sort(...), [pool, sortBy])` | cache sorted result, chain from pool |
| `useCallback((x) => setState(x), [])` | stable handler ref for memo child |
| `React.memo(Component)` | skip re-render when props unchanged |
| `useCallback` without `React.memo` child | pointless |
| `React.memo` with inline object/fn props | pointless (new ref each render) |
