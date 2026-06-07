# Card Match

**Status: LIVE.** Route: `/card-match`.

Enter spending persona + monthly budget → system ranks best cards.

---

## How it works

3-step UI:
1. **Persona** — pick a spend category (badges, e.g. "Ăn uống", "Di chuyển")
2. **Sort by** — cashback or annual_fee
3. **Monthly spend** — slider over `SPEND_STEPS = [1, 2, 3, 5, 7, 10, 15, 20]` (million VND). Default: index 2 → 3M VND/month.

On change → debounced 200ms → `POST /api/ranking` → renders ranked card rows.

Only cards with `cashback_result.cashback > 0` are shown.

---

## API call

```ts
POST /api/ranking
{
  persona: string,         // persona slug
  limit: number,           // default 10
  sort_by: 'cashback' | 'annual_fee',
  monthly_spend: number,   // SPEND_STEPS[idx] * 1_000_000 (raw VND)
}
```

Ranking logic lives entirely in the API repo — web only sends params and renders results.

---

## State persistence

Prefs saved to `localStorage` under key `ow-rec-prefs`:
```ts
{ persona: string | null, rankBy: 'cashback' | 'annual_fee', spendStepIdx: number }
```

URL synced on finder page: `?persona=X&sort_by=Y&spend=Z`. URL params take priority over localStorage on load.

---

## Key files

| Path | Purpose |
|---|---|
| `app/(marketing)/card-match/page.tsx` | Page entry point |
| `components/match/card-match-finder.tsx` | Main UI: persona selector, sort, spend slider, results |
| `components/ow-ui/ow-card-ranked-row.tsx` | Single ranked card row |
| `lib/card-ranker.ts` | Sort order only (cashback desc → annual_fee asc → network_popularity asc) |
| `lib/cashback-calc.ts` | Cashback estimation for display (mirrors API logic) |

---

## getRateDisplay() (important)

In `components/marketing/card-ranking-table.tsx`.

Resolves display rate from `card.cashback.rules` filtered by intent slug (merchant or category match).
- Returns exact rate (e.g., `"8%"`) or range (`"3%–5%"`) for tiered/multi-rule
- Falls back to API `actual_rate` when no rules match

**Do not use `actual_rate` directly** — blended value when spend profile spans multiple rules.

---

## Intent system (API side)

Intents passed via `highlightedSlugs` / `intentSlug` props to `OwCardRankedRow` for display only. Intent data from `getIntentGroups()` → `GET /api/v1/intent-groups`.

**Architecture SSOT:** `../api/.claude/docs/card-ranking.md` — authoritative for intent model, ranking rules, data quality requirements. Read before touching any ranking code.

---

## SEO

- JSON-LD: `CollectionPage` + `ItemList`
- OG metadata with intent name
- Breadcrumb JSON-LD
- `revalidate = 3600` on page
