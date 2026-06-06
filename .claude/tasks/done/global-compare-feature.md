# Global "Add to Compare" + Remove ?compare= Param

**Status:** Planned - not yet started

## Problem

1. `CompareSection` still writes/reads `?compare=id1,id2` - stale pattern since pair URLs (`/so-sanh/id1-vs-id2`) are now handled by SSR (see issue #2)
2. No "add to compare" action in card grids - users must search inside the compare page manually

## Solution

### Part 1: Remove `?compare=` from CompareSection

**File:** `components/compare/compare-section.tsx`

- Remove `useSearchParams()`, `lastProcessedParam`, `lastSynced` refs, and both URL sync effects
- Replace with single navigation effect: when ≥2 cards selected, `router.push('/so-sanh/id1-vs-id2')` (or `router.replace` if already on a pair page)
- Pre-fill from `defaultPair` prop, fallback to recent compares or defaults

**File:** `app/(marketing)/so-sanh/page.tsx`

- Add `searchParams` prop + redirect: `/so-sanh?compare=id1,id2` → `/so-sanh/id1-vs-id2` (backward compat)

### Part 2: Global Compare List Store

**File:** `lib/use-compare-list.ts` (new)

- Same pattern as `lib/use-recent-compares.ts` (localStorage + `useSyncExternalStore`)
- localStorage key: `compare_list`, max 3 IDs
- API: `{ compareList, addToCompare, removeFromCompare, toggleCompare, clearCompare, isInCompare, isFull }`

### Part 3: Floating Compare Bar

**File:** `components/compare/compare-bar.tsx` (new)

- Fixed bottom bar, z-50, slides up when `compareList.length >= 1`
- Shows count + "So sánh ngay" button (enabled when ≥2) + "Xóa" link
- Navigates to `/so-sanh/id1-vs-id2[-vs-id3]`
- Mounted in `app/(marketing)/layout.tsx`

### Part 4: Compare Button on CardTile

**File:** `components/cards/variants/card-tile.tsx`

- 3rd circle button in hover actions: `IconScale` icon, label "So sánh"
- Active state when `isInCompare(card.id)`, disabled when list full and card not in list
- `onClick`: `toggleCompare(card.id)`, stop propagation

## Acceptance Criteria

- [ ] Hover any card tile → scale icon button appears
- [ ] Click cards → floating bar appears at bottom
- [ ] "So sánh ngay" → navigates to `/so-sanh/id1-vs-id2`
- [ ] Landing `/so-sanh` picker → auto-navigates to pair URL (no `?compare=` in address bar)
- [ ] Old `/so-sanh?compare=id1,id2` URL → redirects to `/so-sanh/id1-vs-id2`
- [ ] `pnpm build` passes

## Files Affected

| File | Change |
|------|--------|
| `components/compare/compare-section.tsx` | Remove `?compare=` URL sync |
| `app/(marketing)/so-sanh/page.tsx` | Add backward-compat redirect |
| `lib/use-compare-list.ts` | New - compare list store |
| `components/compare/compare-bar.tsx` | New - floating bar |
| `components/cards/variants/card-tile.tsx` | Add compare button |
| `app/(marketing)/layout.tsx` | Mount CompareBar |
