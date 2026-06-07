# Architecture

## Stack

| Layer         | Tech                                                  |
|---------------|-------------------------------------------------------|
| Framework     | Next.js 16 (App Router)                               |
| Language      | TypeScript (strict)                                   |
| UI            | Tailwind CSS v4, shadcn/ui, Radix UI, Lucide icons    |
| Content       | MDX via next-mdx-remote, gray-matter frontmatter      |
| Search        | Fuse.js (client-side fuzzy search)                    |
| DB            | Dexie.js (IndexedDB) for wallet data (frozen feature) |
| Analytics     | PostHog via `instrumentation-client.ts`               |
| Images        | Sharp for processing, LQIP blur placeholders          |
| AI/Chat       | AI SDK v6, OpenRouter, assistant-ui                   |
| Observability | Langfuse (direct HTTP ingestion — no SDK)             |

Note: `next-intl` is in the codebase but only used inside frozen wallet app routes (`app/app/*`). Not active on marketing pages.

---

## Routes

```
app/
├── (marketing)/
│   ├── page.tsx                   # Home
│   ├── (about)/
│   │   ├── ve-openwallet/         # About
│   │   └── lien-he/               # Contact
│   ├── (legal)/
│   │   ├── chinh-sach-bao-mat/    # Privacy policy
│   │   ├── dieu-khoan/            # Terms
│   │   └── mien-tru-trach-nhiem/  # Disclaimer
│   ├── (persona)/
│   │   └── linh-vuc/[slug]/       # Persona pages (an-uong, di-chuyen, dich-vu-so, doanh-nghiep, du-lich, gia-dinh, shopee, sieu-thi)
│   ├── (tools)/
│   │   ├── card-battle/           # Compare tool — see features/card-battle.md
│   │   ├── card-match/            # Spend matcher — see features/card-match.md
│   │   ├── mcp/                   # MCP landing — see features/openwallet-mcp.md
│   │   └── owie-chat/             # Chat landing — see features/owie-chat.md
│   ├── changelog/                 # Changelog
│   ├── loai-the/                  # Card type filters (the-tin-dung, the-ghi-no, the-hybrid)
│   ├── ngan-hang/[slug]/          # Bank listing + detail
│   └── the/[slug]/                # Card listing + detail
├── (blog)/
│   └── tin-tuc/                   # Blog listing + /[slug], /category/[cat], /tag/[tag]
├── (chat)/
│   └── chat/                      # Full chat app — see features/owie-chat.md
├── api/
│   ├── [...path]/                 # API proxy pass-through
│   ├── cashback/                  # Cashback calc endpoint
│   ├── chat/                      # Chat route handler (AI SDK)
│   ├── health/                    # Health check
│   └── ranking/                   # Card ranking proxy
├── app/                           # FROZEN wallet app (404 unless WALLET_ENABLED=true)
│   ├── add/
│   ├── my-cards/
│   ├── reminders/
│   ├── settings/
│   └── upcoming/
├── search-index.json/             # Search API endpoint
└── sitemap.ts                     # Dynamic XML sitemap
```

---

## Key files

| Path                         | Purpose                                                                                                                                                                                                                                                                                                                                          |
|------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `lib/api.ts`                 | REST client — all API fns + types. `getCards()` / `getCard()` return raw `Card`. Always use `apiFetch()`, never raw `fetch()`.                                                                                                                                                                                                                   |
| `lib/card-model.ts`          | `CardModel` — domain wrapper around `Card`. **SSOT for all card field access in display components.** Construct once at page/API boundary: `new CardModel(card)`. Pass `CardModel` down; never pass raw `Card` to display components. Use `cardModel.toRaw()` only at serialization/API boundaries (e.g. `lib/page-meta/`, `ChatContextSetter`). |
| `lib/page-meta/`             | JSON-LD + OG metadata builders — accept raw `Card`, not `CardModel`                                                                                                                                                                                                                                                                              |
| `lib/mdx.ts`                 | Post parsing, queries, TOC extraction                                                                                                                                                                                                                                                                                                            |
| `lib/db.ts`                  | Dexie schema (wallet, frozen)                                                                                                                                                                                                                                                                                                                    |
| `lib/card-dates.ts`          | Statement/due date computation (`getStatementObject`)                                                                                                                                                                                                                                                                                            |
| `lib/cashback-calc.ts`       | `calcCashback(card, spendProfile)` — estimates monthly cashback; handles rule ordering (specific-first), per-rule caps, min_spend gate, global cap. Rules with empty `categories[]` AND `merchants[]` score 0 (no implicit universal).                                                                                                           |
| `lib/card-ranker.ts`         | `rankCards(cards, spendProfile)` — sort logic only (cashback desc → annual_fee asc → network_popularity asc). `DEFAULT_MONTHLY_SPEND = 3_000_000`. `RankedCard.card` is still raw `Card` — `ow-card-ranked-row` wraps to `CardModel` internally.                                                                                                 |
| `lib/tools.ts`               | `getTool(name)` — canonical href/label for each tool (Card Battle, Card Match, etc.)                                                                                                                                                                                                                                                             |
| `lib/routes.ts`              | Route constants                                                                                                                                                                                                                                                                                                                                  |
| `lib/langfuse.ts`            | Langfuse direct HTTP ingestion for chat observability                                                                                                                                                                                                                                                                                            |
| `lib/chat/`                  | Chat system prompt + related chat utilities                                                                                                                                                                                                                                                                                                      |
| `lib/use-search.ts`          | Fuse.js search hook                                                                                                                                                                                                                                                                                                                              |
| `lib/intent-map-context.tsx` | React context for intent map (slug → Intent)                                                                                                                                                                                                                                                                                                     |
| `content/posts/`             | Blog MDX files (`<slug>.mdx`)                                                                                                                                                                                                                                                                                                                    |
| `content/changelog.mdx`      | Changelog content                                                                                                                                                                                                                                                                                                                                |
| `content/so-sanh/`           | Legacy compare MDX (unused — see comment in card-battle `[pair]/page.tsx`)                                                                                                                                                                                                                                                                       |
| `messages/vi.json`           | Vietnamese UI translations (used in frozen wallet app only)                                                                                                                                                                                                                                                                                      |
| `instrumentation-client.ts`  | PostHog analytics init                                                                                                                                                                                                                                                                                                                           |

---

## JSON-LD structured data

All public pages emit `<script type="application/ld+json">` via `lib/page-meta/`:
- **BlogPosting** — blog posts (`blog-post.ts`)
- **FinancialProduct** — card detail pages (`card.ts`)
- **FinancialService** + ItemList — bank detail pages (`bank.ts`)
- **CollectionPage** + ItemList — listing/category/tag pages (`collection.ts`)
- **BreadcrumbList** — all pages (`breadcrumb.ts`)
- **Compare** — card battle pages (`compare.ts`)

---

## API helpers (lib/api.ts)

| Fn                              | Endpoint                                                                                                                                      |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `getCards(filters?)`            | `/api/v1/cards` — supports `type`, `network`, `bank_id`, `co_brand`, `intent`, `tier`, `metal`, `for_business`, `network_tier`, `contactless` |
| `getCard(id)`                   | `/api/v1/cards/{id}`                                                                                                                          |
| `getRelatedCards(id)`           | `/api/v1/cards/{id}/related`                                                                                                                  |
| `getRelatedCardsForMany(ids[])` | parallel `getRelatedCards` with `.catch(() => [])`                                                                                            |
| `getComparePairs()`             | `/api/v1/compare-pairs`                                                                                                                       |
| `getIntents()`                  | `/api/v1/intents` — flat intent list (slug, label, icon, categories[], merchants[])                                                           |
| `getIntentGroups()`             | `/api/v1/intent-groups` — nested group tree for UI navigation (macro→micro→atomic)                                                            |
| `getCashbackCategories()`       | `/api/v1/cashback-categories`                                                                                                                 |
| `getBanks()` / `getBank(id)`    | `/api/v1/banks`                                                                                                                               |
| `getPersonas()`                 | `/api/v1/personas` — persona list for Card Match                                                                                              |

---

## Server schema

See `.claude/docs/schema.md` — D1 SQL schema for reminders, delivery_logs, and future sync tables (accounts, wallets, wallet_cards).
