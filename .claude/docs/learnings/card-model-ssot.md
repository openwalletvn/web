# CardModel as SSOT for display-layer card data

## Pattern

`lib/api.ts` returns raw `Card` objects. `lib/card-model.ts` wraps them in `CardModel` — a stateless class that exposes all field access and computation as typed methods.

**Rule:** construct `new CardModel(card)` once at the page or API fetch boundary. Pass `CardModel` to all display components. Never construct `CardModel` inside a child component.

```ts
// Page (RSC) — wrap once
const cardModel = new CardModel(card);
const relatedModels = relatedCards.map(c => new CardModel(c));

// Pass model down
<CardDetailHeader card={cardModel} />
<CardMasonry cards={relatedModels} />
```

## What accepts CardModel vs raw Card

| Layer | Type |
|---|---|
| `components/ow-ui/ow-card-image` | `CardModel` |
| `components/ow-ui/ow-card-intent-badges` | `CardModel` |
| `components/cards/variants/card-display` | `CardModel` |
| `components/cards/card-masonry` | `CardModel[]` |
| `components/cards/cards-section` | wraps internally (fetches `Card[]`, wraps before `CardMasonry`) |
| `components/cards/cards-grid` | accepts `Card[]` from caller, wraps at `CardMasonry` boundary |
| `components/cards/detail/*` | `CardModel` |
| `lib/page-meta/*` | raw `Card` (pure computation, not display) |
| `lib/card-ranker.ts` → `RankedCard.card` | raw `Card` (`ow-card-ranked-row` wraps internally) |
| Wallet components (frozen) | wrap inline at `OwCardImage` call sites only |

## Escape hatch

`cardModel.toRaw()` — returns the underlying `Card`. Use only at:
- `lib/page-meta/` builders
- `ChatContextSetter` context object
- Any other serialization boundary that must receive a plain object

## Adding new getters

When a component needs a new `Card` field not yet on `CardModel`, add a getter in `lib/card-model.ts` under the "Raw data getters" section. Do not access `card.fieldName` directly in components.

## Exceptions (intentional)

- `cards-grid.tsx` filters on raw `Card[]` before wrapping — filtering logic uses direct field access for performance; wrapping happens only at the `CardMasonry` render boundary.
- `compare-row-defs.tsx` `getValue`/`getDescription` fn signatures take `Card | null` — tied to the compare API response shape; wraps inline only at `OwCardIntentBadges` call site.
