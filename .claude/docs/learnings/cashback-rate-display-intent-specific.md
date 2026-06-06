# Cashback Rate Display: Use Rule Rate, Not actual_rate

## Problem

API `cashback_result.actual_rate` is a **blended effective rate** - when a card has multiple rules (e.g. 8% for Shopee, 10% for ecommerce catch-all) and the spend profile touches both, the API returns something like `actual_rate: 9`. Displaying this is misleading when the user filtered to a specific intent.

## Fix

`getRateDisplay(card, intentSlug?)` in `card-ranking-table.tsx`:

1. Filter `card.cashback.rules` by `intentSlug` (match `r.categories` or `r.merchants`)
2. If no specific match → fall back to universal rules (no categories/merchants)
3. If still no rules → return `""` → caller uses `actual_rate` as last resort
4. Collect all rate endpoints (including `rate_max` for tiered rules) → return single rate or `"min%–max%"` range

## Propagation

- `CardRankingTable` has `intentSlug` prop → passes to `RankedRow` → passes to `CashbackDisplay`
- `RecommendationFinder` uses `RankedRow` directly: pass `intentSlug={activeIntentSlugs.length === 1 ? activeIntentSlugs[0] : undefined}` - only when single active intent, otherwise blend is appropriate

## Rule

Never display `actual_rate` as the primary rate label. Always resolve from `card.cashback.rules` for the specific intent context first.
