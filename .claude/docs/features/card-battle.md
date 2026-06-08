# Card Battle

**Status: LIVE.** Route: `/card-battle`.

Compare 2-3 cards side by side. Data-driven: fees, cashback, perks.

---

## Routes

| Route | Type | Notes |
|---|---|---|
| `/card-battle` | Dynamic (ISR, revalidate 3600) | Landing page; `?compare=A,B` redirects to `/card-battle/A-vs-B` |
| `/card-battle/[pair]` | Static + `dynamicParams = true` (ISR) | Pre-generated for known pairs; unknown pairs rendered on demand |

---

## ?compare redirect

`/card-battle?compare=A,B` → parses up to 3 IDs → `redirect(/card-battle/A-vs-B-vs-C)`.
If `ids.length < 2`, no redirect — falls through to landing.

---

## [pair] static generation

`generateStaticParams()` calls `getComparePairs()` → `GET /api/v1/compare-pairs`.
Returns `{ pair: p.compare_path.slice(1) }` for each known pair.

`dynamicParams = true` — unknown pairs are rendered on-demand (not 404). Invalid card ID → `notFound()`.

Supports 2 or 3 cards: `A-vs-B` or `A-vs-B-vs-C`. `ids.length < 2 || ids.length > 3` → `notFound()`.

---

## 404 redirect (legacy URLs)

`SoSanh404Redirect` in `components/layout/so-sanh-404-redirect.tsx`, used in `app/not-found.tsx`.

Handles legacy `/so-sanh/X-vs-Y` URLs → redirects to `/card-battle/X-vs-Y`. Do not remove.

---

## Data flow

```
/card-battle
  → ?compare=A,B present → redirect to /card-battle/A-vs-B
  → no compare param → load DEFAULT_CARD_IDS suggested cards, render CompareSection (empty state)

/card-battle/[pair]
  → split pair on '-vs-'
  → getCard(id) × N in parallel → notFound() if any null
  → getRelatedCardsForMany(ids) + getIntents() in parallel
  → buildComparePageMeta(cardA, cardB) → jsonLd + breadcrumbItems + metadata
  → render CompareSection (pre-loaded pair) + CompareSuggestedCards
```

`DEFAULT_CARD_IDS = ['sacombank-uniq', 'msb-visa-online']` — used for suggested cards on landing.

---

## Key files

| Path | Purpose |
|---|---|
| `app/(marketing)/(tools)/card-battle/page.tsx` | Landing; ?compare redirect |
| `app/(marketing)/(tools)/card-battle/[pair]/page.tsx` | Static pair page |
| `app/(marketing)/(tools)/card-battle/opengraph-image.tsx` | OG image |
| `components/compare/compare-section.tsx` | Main compare UI |
| `components/compare/compare-suggested-cards.tsx` | Related cards below compare |
| `lib/page-meta/compare.ts` | `buildComparePageMeta()` — JSON-LD + OG + breadcrumbs |
| `components/layout/so-sanh-404-redirect.tsx` | Legacy URL redirect handler |

---

## SEO

Each `/card-battle/[pair]` page has full SEO via `buildComparePageMeta(cardA, cardB)`:
- JSON-LD: compare-specific structured data + breadcrumb
- OG metadata with both card names
- `revalidate = 3600`

Landing `/card-battle` has breadcrumb JSON-LD only (no card-specific data).
