# Architecture

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript (strict) |
| UI | Tailwind CSS v4, shadcn/ui (new-york), Radix UI, Lucide icons |
| Content | MDX via next-mdx-remote, gray-matter frontmatter |
| Search | Fuse.js (client-side fuzzy search) |
| DB | Dexie.js (IndexedDB) for wallet data |
| Analytics | PostHog (instrumentation-client.ts pattern) |
| i18n | next-intl (Vietnamese only) |
| Images | Sharp for processing, LQIP blur placeholders |
| API docs | Scalar |

## Routes

```
app/
├── (marketing)/          # Public pages (static export)
│   ├── page.tsx          # Home
│   ├── ngan-hang/        # Banks listing + /[id] detail
│   ├── the/              # Cards listing + /[id] detail
│   ├── the-tin-dung/     # Filtered card views (credit, debit, etc.)
│   ├── so-sanh/          # Card compare listing + /[pair] static pages
│   ├── tin-tuc/          # Blog listing + /[slug], /category/[cat], /tag/[tag]
│   ├── changelog/        # Changelog
│   ├── docs/             # API documentation (Scalar)
│   ├── gioi-thieu/       # About
│   └── lien-he/          # Contact
├── app/                  # Private wallet app (client-side, Dexie)
│   ├── add/              # Add card wizard
│   ├── my-cards/         # Card management
│   ├── settings/         # Export/import wallet
│   └── upcoming/         # Upcoming payments
├── sitemap.ts            # Dynamic XML sitemap
└── search-index.json/    # Search API endpoint
```

## Key files

| Path | Purpose |
|------|---------|
| `lib/api.ts` | REST client — all API fns + types. `getCards()` / `getCard()` return raw `Card`. |
| `lib/card-model.ts` | `CardModel` — domain wrapper around `Card`. **SSOT for all card field access in display components.** Construct once at page/API boundary: `new CardModel(card)`. Pass `CardModel` down; never pass raw `Card` to display components. Use `cardModel.toRaw()` only at serialization/API boundaries (e.g. `lib/page-meta/`, `ChatContextSetter`). See `CardModel` getter list in the file for all available methods. |
| `lib/page-meta/` | JSON-LD + OG metadata builders — accept raw `Card`, not `CardModel` |
| `lib/mdx.ts` | Post parsing, queries, TOC extraction |
| `lib/db.ts` | Dexie schema |
| `lib/card-dates.ts` | Statement/due date computation (`getStatementObject`) |
| `lib/cashback-calc.ts` | `calcCashback(card, spendProfile)` — estimates monthly cashback; handles rule ordering (specific-first), per-rule caps, min_spend gate, global cap. Rules with empty `categories[]` AND `merchants[]` score 0 (no implicit universal). |
| `lib/card-ranker.ts` | `rankCards(cards, spendProfile)` — sort logic only (cashback desc → annual_fee asc → network_popularity asc). `DEFAULT_MONTHLY_SPEND = 3_000_000`. `RankedCard.card` is still raw `Card` — `ow-card-ranked-row` wraps to `CardModel` internally. |
| `components/marketing/card-ranking-table.tsx` | `getRateDisplay(card, intentSlug?)` — resolves display rate from `card.cashback.rules` filtered by intent slug (merchant or category match). Returns exact rate (e.g. `"8%"`) or range (`"3%–5%"`) for tiered/multi-rule. Falls back to API `actual_rate` when no rules match. **Do not use `actual_rate` directly** — it is a blended value when the spend profile spans multiple rules. |
| `lib/use-search.ts` | Fuse.js search hook |
| `content/posts/` | Blog MDX files (`<slug>.mdx`) |
| `content/changelog/` | Changelog MDX (`YYYY-MM-DD-<slug>.mdx`) |
| `messages/vi.json` | Vietnamese UI translations |

## JSON-LD structured data

All public pages emit `<script type="application/ld+json">` via `lib/page-meta/`:
- **BlogPosting** — blog posts (`blog-post.ts`)
- **FinancialProduct** — card detail pages (`card.ts`)
- **FinancialService** + ItemList — bank detail pages (`bank.ts`)
- **CollectionPage** + ItemList — listing/category/tag pages (`collection.ts`)
- **BreadcrumbList** — all pages (`breadcrumb.ts`)

## So-sanh (compare) route

- `/so-sanh/[pair]` — statically generated for known pairs via `getComparePairs()`
- Unknown pair → 404 → `SoSanh404Redirect` (`components/layout/so-sanh-404-redirect.tsx`) → `/so-sanh?compare=A,B`

## API helpers (lib/api.ts)

| Fn | Endpoint |
|----|---------|
| `getCards(filters?)` | `/api/v1/cards` — supports `type`, `network`, `bank_id`, `co_brand`, `intent`, `tier`, `metal`, `for_business`, `network_tier`, `contactless` |
| `getCard(id)` | `/api/v1/cards/{id}` |
| `getRelatedCards(id)` | `/api/v1/cards/{id}/related` |
| `getRelatedCardsForMany(ids[])` | parallel `getRelatedCards` with `.catch(() => [])` |
| `getComparePairs()` | `/api/v1/compare-pairs` |
| `getIntents()` | `/api/v1/intents` — flat intent list (slug, label, icon, categories[], merchants[]) |
| `getIntentGroups()` | `/api/v1/intent-groups` — nested group tree for UI navigation (macro→micro→atomic) |
| `getCashbackCategories()` | `/api/v1/cashback-categories` |
| `getBanks()` / `getBank(id)` | `/api/v1/banks` |

## Planned server schema

See `.claude/docs/schema.md` — D1 SQL schema for reminders, delivery_logs, and future sync tables (accounts, wallets, wallet_cards).
