# Card Recommendation ("Cá Nhân Hóa Tìm Kiếm")

**Status:** Planned — not yet started

## Problem

No personalized card discovery. Users browse by category or scroll the full list. They cannot input their actual spending habits and get a ranked recommendation across all cards.

## Solution

A recommendation finder: user picks one spending intent (chip picker) + optional monthly spend → `rankCards()` returns best matching cards. Surfaced as a dedicated page (`/goi-y-the`) and a compact homepage widget.

### Algorithm

Reuse existing `rankCards(cards, { [intentSlug]: spend })` unchanged. No new ranking logic.

- Single intent selected via chip (from `getIntents()`)
- Spend optional, defaults to 3,000,000 VND/month
- Tab "Cá nhân" filters `!for_business`; tab "Doanh nghiệp" → "Coming soon"

### Page: `/goi-y-the`

Two-column layout (ref: `public/card-rec.png`):

- **Left:** Hero title + tab toggle + Step 1 (intent chips) + Step 2 optional (spend selector)
- **Right:** Live results ("KẾT QUẢ ĐỀ XUẤT") — top 5 ranked cards with tagline + "Xem Thẻ" CTA

URL params `?intent=du-lich&spend=3000000` → shareable results. State priority: URL params > localStorage > defaults.

### Homepage Widget

`<RecommendationFinder compact limit={3} />` — no hero, top 3 results, "Xem đầy đủ" button links to full page with current intent/spend params.

### Persistence

`localStorage['ow-rec-prefs']` = `{ tab, intentSlug, spend }`. Synced on every state change.

## Acceptance Criteria

- [ ] `/goi-y-the` renders hero + two-column layout matching design
- [ ] Click intent chip → results populate instantly
- [ ] Change spend → results re-rank
- [ ] URL updates `?intent=&spend=` on state change → copy URL and open in new tab preserves state
- [ ] Reload with no URL params → localStorage restores state
- [ ] "Doanh nghiệp" tab → "Coming soon" shown
- [ ] Homepage widget: compact, 3 results, "Xem đầy đủ" → `/goi-y-the?intent=...&spend=...`
- [ ] "Xem Thẻ" → `/the/[slug]`
- [ ] `pnpm build` + `pnpm lint` pass

## Files Affected

| File | Change |
|------|--------|
| `components/marketing/recommendation-finder.tsx` | New — full component (page + widget modes) |
| `app/(marketing)/goi-y-the/page.tsx` | New — dedicated page |
| `lib/spend-options.ts` | New — extract SPEND_OPTIONS from card-ranking-table |
| `components/marketing/card-ranking-table.tsx` | Import shared SPEND_OPTIONS |
| `app/(marketing)/page.tsx` | Add RecommendationFinder widget section |
| sitemap config | Add `/goi-y-the` |
