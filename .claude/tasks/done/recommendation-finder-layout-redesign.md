# Recommendation Finder Layout Redesign

## Task

Redesign `recommendation-finder.tsx` with a red banner header, tab toggle (Cá nhân / Doanh nghiệp), and a unified two-panel layout that always renders the same way (no compact/full split). Left panel has two steps: multi-select intent chips (Bước 01) and a spend selector with chevron navigation (Bước 02). Right panel shows ranked card results unchanged.

## Acceptance Criteria

- [ ] Red banner with bold "Cá Nhân Hóa Tìm Kiếm" renders above the tabs
- [ ] Tab toggle: Cá nhân (default active) / Doanh nghiệp (shows coming-soon state)
- [ ] `compact` prop removed; single unified layout always rendered
- [ ] Bước 01 chips are multi-select: clicking toggles slug in/out of `intentSlugs[]`
- [ ] Bước 02 spend uses Select + left/right chevron buttons (same pattern as `card-ranking-table.tsx`)
- [ ] `rankCards` called with `Object.fromEntries(intentSlugs.map(s => [s, spend]))` for multi-intent
- [ ] URL syncs `?intent=slug1,slug2&spend=...`; localStorage persists across refresh
- [ ] Results panel unchanged (ResultRow component, "KẾT QUẢ ĐỀ XUẤT" label)
- [ ] Any callers of `compact` prop updated

## Files Affected

| File | Change |
|------|--------|
| `components/marketing/recommendation-finder.tsx` | Full layout redesign, multi-select state, remove compact branch |
| Any page importing `<RecommendationFinder compact>` | Remove `compact` prop |

## Notes

- `rankCards(cards, Record<string, number>)` already supports multi-intent — no lib changes needed
- Spend chevron pattern: `card-ranking-table.tsx` lines 100–129 (IconChevronLeft/Right, `SPEND_OPTIONS`, `spendIdx` derived from `SPEND_OPTIONS.findIndex`)
- `intentSlugs: string[]` replaces `intentSlug: string` in state and `RecPrefs` storage type
- URL read: split `intent` param by comma; write: join with comma
