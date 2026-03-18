# OpenWallet — Project Context

## What this is

Vietnamese-first web app for comparing bank cards, managing personal wallets, and publishing financial content. Two halves: a public marketing site (SEO-heavy, static export) and a private client-side wallet app (Dexie.js / IndexedDB).

**Base URL:** `https://openwallet.vn`
**API:** `https://api.openwallet.vn/api/v1/`

## Core principles

1. **Local-first** — wallet data lives in IndexedDB via Dexie.js. No server accounts.
2. **Vietnamese-first** — UI, content, and SEO target Vietnamese users. Technical terms stay English.
3. **SEO-first** — every public page has JSON-LD structured data, OG metadata, and sitemap entries.
4. **Static export** — `output: 'export'` in next.config.ts. No server runtime.

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript (strict) |
| UI | Tailwind CSS v4, shadcn/ui (new-york), Radix UI, Lucide icons |
| Content | MDX via next-mdx-remote, gray-matter frontmatter |
| Search | Fuse.js (client-side fuzzy search) |
| DB | Dexie.js (IndexedDB) for wallet data |
| Analytics | PostHog |
| i18n | next-intl (Vietnamese only) |
| Images | Sharp for processing, LQIP blur placeholders |
| API docs | Scalar |

## Commands

```bash
pnpm dev              # Dev server
pnpm build            # Production build (static export)
pnpm lint             # Next.js linter
pnpm validate:posts   # Validate blog post frontmatter
pnpm admin            # Admin server (image generation, post mgmt)
```

## Route structure

```
app/
├── (marketing)/          # Public pages
│   ├── page.tsx          # Home
│   ├── ngan-hang/        # Banks listing + /[id] detail
│   ├── the/              # Cards listing + /[id] detail
│   ├── the-tin-dung/     # Filtered card views (credit, debit, etc.)
│   ├── tin-tuc/          # Blog listing + /[slug], /category/[cat], /tag/[tag]
│   ├── changelog/        # Changelog
│   ├── docs/             # API documentation (Scalar)
│   ├── gioi-thieu/       # About
│   └── lien-he/          # Contact
├── app/                  # Private wallet app
│   ├── page.tsx          # Dashboard
│   ├── add/              # Add card
│   ├── my-cards/         # Card management
│   ├── settings/         # Settings
│   └── upcoming/         # Upcoming payments
├── sitemap.ts            # Dynamic XML sitemap
└── search-index.json/    # Search API endpoint
```

## Key directories

| Path | Purpose |
|------|---------|
| `content/posts/` | Blog MDX files (`<slug>.mdx`) |
| `content/changelog/` | Changelog MDX files (`YYYY-MM-DD-<slug>.mdx`) |
| `public/images/posts/<slug>/` | Blog post images (WebP) |
| `lib/page-meta/` | JSON-LD + metadata builders per page type |
| `lib/api.ts` | REST client for cards/banks API |
| `lib/mdx.ts` | Post parsing, queries, TOC extraction |
| `lib/db.ts` | Dexie database schema |
| `lib/search-types.ts` | Search index types |
| `lib/use-search.ts` | Fuse.js search hook |
| `messages/vi.json` | Vietnamese UI translations |
| `scripts/validate-posts.js` | Post validation script |

## Blog content

- **Categories** (exactly 4): `Review the`, `Huong dan`, `Tin tuc`, `So sanh the`
- **Frontmatter**: title, description, date, category, tags, status (required); author, ai_generated, card_slugs, cover_image, image_prompts, updated (optional)
- **Images**: `/public/images/posts/<slug>/<filename>.webp`
- **Headings**: `##`, `###`, `####` only (no `#`). Auto-TOC generated.

## JSON-LD structured data

All public pages emit `<script type="application/ld+json">` via `lib/page-meta/`:
- **BlogPosting** — blog posts (`blog-post.ts`)
- **FinancialProduct** — card detail pages (`card.ts`)
- **FinancialService** + ItemList — bank detail pages (`bank.ts`)
- **CollectionPage** + ItemList — listing/category/tag pages (`collection.ts`)
- **BreadcrumbList** — all pages (`breadcrumb.ts`)

## API authentication

- All build-time fetch calls to `api.openwallet.vn` **must** use the `apiFetch()` helper from `lib/api.ts`.
- `apiFetch()` automatically injects the `X-OpenWallet-Key` header from `process.env.OPENWALLET_API_KEY`.
- **Never** use `NEXT_PUBLIC_` prefix for `OPENWALLET_API_KEY` — it is a server-only build-time secret.
- **Never** use raw `fetch()` for API calls — always go through `apiFetch()`.
- The `apiUrl` constant in `lib/api.ts` handles base URL; pass only the path to `apiFetch()` (e.g. `apiFetch('/api/v1/cards')`).

## Learnings & Concepts

Personal knowledge base for concepts and patterns encountered while building this project.

- **Notes:** `.claude/docs/learnings/` — review anytime to consolidate knowledge

## Meta-rules

1. **Before starting any task**, check `.claude/commands/` for a relevant command file.
2. **After creating a new command**, add it to the commands table below.
3. **After solving any non-trivial task**, check whether new concepts, patterns, or decisions were involved — if yes, suggest updating `.claude/docs/learnings/` and offer to write the note. Topics worth noting: anything about static export constraints, SEO/JSON-LD patterns, Dexie/IndexedDB, MDX pipeline, Next.js App Router patterns, performance decisions, or tools encountered for the first time.

## Custom commands

| Command | File | Purpose |
|---------|------|---------|
| `/write-post` | `commands/write-post.md` | Write a new blog post |
| `/generate-images` | `commands/generate-images.md` | Add images to blog posts + Gemini prompts |
| `/add-json-ld` | `commands/add-json-ld.md` | Add JSON-LD structured data to a page |
| `/add-changelog` | `commands/add-changelog.md` | Add a changelog entry |
