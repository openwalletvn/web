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
| `lib/api.ts` | REST client — all API fns + types |
| `lib/page-meta/` | JSON-LD + OG metadata builders per page type |
| `lib/mdx.ts` | Post parsing, queries, TOC extraction |
| `lib/db.ts` | Dexie schema |
| `lib/card-dates.ts` | Statement/due date computation (`getStatementObject`) |
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
| `getCards(filters?)` | `/api/v1/cards` |
| `getCard(id)` | `/api/v1/cards/{id}` |
| `getRelatedCards(id)` | `/api/v1/cards/{id}/related` |
| `getRelatedCardsForMany(ids[])` | parallel `getRelatedCards` with `.catch(() => [])` |
| `getComparePairs()` | `/api/v1/compare-pairs` |
| `getIntents()` | `/api/v1/intents` |
| `getCashbackCategories()` | `/api/v1/cashback-categories` |
| `getBanks()` / `getBank(id)` | `/api/v1/banks` |

## Planned server schema

See `.claude/docs/schema.md` — D1 SQL schema for reminders, delivery_logs, and future sync tables (accounts, wallets, wallet_cards).
