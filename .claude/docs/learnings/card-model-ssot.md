# CardModel as SSOT for card computation

## Key constraint: Next.js RSC→client boundary

Class instances cannot be serialized across the RSC→client boundary. Next.js throws at runtime:
> Only plain objects, and a few built-ins, can be passed to Client Components from Server Components.

This means `CardModel` can only be passed as a prop within RSC subtrees. Client components must receive raw `Card` and construct `CardModel` internally.

## Boundary rules

**RSC → RSC:** pass `CardModel` freely.
**RSC → client (`'use client'`):** pass raw `Card`. Client wraps internally.

```ts
// RSC page — wrap once for RSC children
const cardModel = new CardModel(card);

// RSC child — receives CardModel ✓
<CardDetailHeader card={cardModel} />

// Client child — receives raw Card ✓ (wraps CardModel inside)
<CardDetailBillingCycle card={card} />
<OwCardImage card={card} />
<CardMasonry cards={rawCards} />
```

## What accepts CardModel vs raw Card

| Component | Type | RSC? |
|---|---|---|
| `card-detail-header` | `CardModel` | RSC |
| `card-detail-fees` | `CardModel` | RSC |
| `card-detail-cashback` | `CardModel` | RSC |
| `card-detail-sources` | `CardModel` | RSC |
| `card-detail-last-modified` | `CardModel` | RSC |
| `card-detail-other-fees` | `CardModel` | RSC |
| `card-detail-intents` | `CardModel` | RSC |
| `card-detail-related` | `Card[]` | RSC (passes to `CardMasonry` client) |
| `card-detail-compare` | `RelatedCard[]` | RSC (passes to `CardMasonry` client) |
| `ow-card-image` | `Card` | client |
| `ow-card-intent-badges` | `Card` | client |
| `card-display` | `Card` | client |
| `card-masonry` | `Card[]` | client |
| `card-detail-billing-cycle` | `Card` | client |
| `compare-suggested-cards` | `Card[]` | client |
| `persona-pool-cards` | `Card[]` | RSC (passes to `CardDisplay` client) |
| `lib/page-meta/*` | raw `Card` | RSC utility (not a component) |

## Where CardModel is constructed

- **RSC page** (`the/[slug]/page.tsx`): `new CardModel(card)` once → passed to RSC detail children
- **Client components**: each constructs `new CardModel(card)` at top of function body for computation only (`getNextDueDate`, `getRateDisplay`, `buildSlugRateMap` etc.) — not for prop passing

## toRaw()

`cardModel.toRaw()` — returns underlying `Card`. Use at:
- `lib/page-meta/` builders
- `ChatContextSetter` context object
- Passing from RSC `CardModel` to a client component prop (e.g. `card-detail-intents` → `OwCardIntentBadges`)

## Adding new getters

New `Card` field needed? Add getter to `lib/card-model.ts` under "Raw data getters". RSC components use it via model. Client components access raw field directly or construct model internally.

## Lesson learned

Check `'use client'` markers before designing prop types. If a component or its parent subtree is client-side, `CardModel` cannot be a prop — plan for raw `Card` at that boundary from the start.
