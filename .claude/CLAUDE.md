# OpenWallet

Vietnamese-first web app: public card-comparison site (SEO, SSR/SSG on Vercel) + private wallet app (IndexedDB).

**Base URL:** `https://openwallet.vn` | **API:** `https://api.openwallet.vn/api/v1/`

## Local repo layout

Three sibling repos share the same parent folder:

| Repo       | Relative path from this repo |
|------------|------------------------------|
| web (this) | `.`                          |
| api        | `../api`                     |
| mcp        | `../mcp`                     |

When asked to "edit local api repo" → work in `../api`. "edit local mcp repo" → work in `../mcp`.

## Commands
- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Validate posts: `pnpm validate:posts`
- Admin server: `pnpm admin`
- Storybook: `pnpm storybook` → http://localhost:4000
- Generate types: `pnpm generate:types` — regen from API schema
- Check types: `pnpm check:types`
- Chat evals: `pnpm eval`
- Push system prompt: `pnpm push:prompt` (confirm with user first — see memory)
- Chat log viewer: `pnpm chatlog`

## Core principles
1. **Vercel deployment** - SSR/SSG via Vercel. Dynamic routes allowed. Data fetched at build time where possible.
2. **Local-first** - wallet data in IndexedDB via Dexie.js. No server accounts.
3. **Vietnamese-first** - UI/content targets Vietnamese users. Technical terms stay English.
4. **SEO-first** - every public page has JSON-LD, OG metadata, sitemap entries.

## ISR revalidation (required for all marketing pages)

Every `app/(marketing)/**/page.tsx` that calls any API fetch **must** export:

```ts
export const revalidate = 3600;
```

Without this, pages are pure dynamic SSR - every request hits the API live. On Vercel, a slow or cold API response causes a function timeout → error page. With `revalidate`, Vercel pre-renders at build time and serves cached HTML, revalidating in the background. Reload-fixes-it is the symptom of a missing `revalidate`.

## Breadcrumbs

Every marketing page **must** include breadcrumb JSON-LD via `buildBreadcrumbJsonLd()` from `lib/page-meta/breadcrumb.ts`. Pass `breadcrumbItems` into the page's `<JsonLd>` component.

Pattern:
```ts
const breadcrumbItems = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Section', href: '/section'},
    {label: 'Current page'}, // no href on last item
];
```

When adding a new marketing page, add breadcrumb JSON-LD immediately — do not leave it for later.

## Layout & CSS rules

See `@.claude/DESIGN.md` for container conventions, CSS/typography rules, and full design system.

## API authentication
- Always use `apiFetch()` from `lib/api.ts` - auto-injects `X-OpenWallet-Key` header.
- Never use `NEXT_PUBLIC_` prefix for `OPENWALLET_API_KEY` - server-only build secret.
- Never use raw `fetch()` for API calls. Pass only path: `apiFetch('/api/v1/cards')`.

## Blog content rules
- **Categories**: `Review the`, `Huong dan`, `Tin tuc`, `So sanh the`, `Case Study` — dynamic, add new ones freely (no code enum)
- **Frontmatter required**: title, description, date, category, tags, status
- **Headings**: `##`, `###`, `####` only (no `#`). Auto-TOC generated.
- **Images**: `/public/images/posts/<slug>/<filename>.webp`

## Writing rules
- **No em dashes (-):** Never use em dashes in any page content or metadata. Replace with a comma, colon, parentheses, or restructure the sentence. Em dashes are a visible AI writing signal.
- **Tone for public pages:** Professional and honest, not corporate or casual. Use "chúng tôi" consistently. Avoid overly informal phrasing.

## Feature gate status

### Wallet app (`/app/*`) - FROZEN
- Routes return 404 unless `WALLET_ENABLED=true` env var is set.
- Gate is in `app/app/layout.tsx` (server component) → calls `notFound()`.
- Shell code lives in `app/app/app-shell.tsx` (client component, untouched).
- `WalletNavButton` component exists but is not used anywhere - do not add it to nav.
- Do not delete wallet code. May revive later. ROI currently too low vs competitors.
- `public/robots.txt` has `Disallow: /app`. Keep this.

### Owie Chat (`/owie-chat`) - LIVE
- `/owie-chat` — public landing + info page. No auth. Free to use.
- `/chat` — full chat app (separate route group `app/(chat)/`).
- Legacy redirect: `/openwallet-chat` → `/owie-chat` (next.config.ts, keep).
- `OpenOwieButton` — opens chat panel (use in marketing pages).
- `ChatToggleButton` — exists but NOT in header. Do not re-add unless explicitly requested (UX decision, separate from launch status).
- **Full chat docs (arch, logging, Langfuse, evals):** `.claude/docs/chat.md`

### `so-sanh-404-redirect`
- Active. Handles legacy `/card-battle/X-vs-Y` URLs → redirects to `/card-battle?compare=X,Y`.
- Lives in `components/layout/so-sanh-404-redirect.tsx`, used in `app/not-found.tsx`. Do not remove.

## Card ranking

**Architecture SSOT: `../api/.claude/docs/card-recommendation-architecture.md`** - authoritative doc for intent model, intent groups, ranking rules, and data quality requirements. Read this before touching any ranking or recommendation code.

**Ranking logic lives in the API repo.** The web repo only consumes results:
- `lib/cashback-calc.ts` - cashback estimation (mirrors API logic for display)
- `lib/card-ranker.ts` - sort order only (cashback desc → annual_fee asc → network_popularity asc)
- `components/marketing/card-ranking-table.tsx` - UI with spend selector
- `components/marketing/recommendation-finder.tsx` - macro→micro→atomic intent selector + `POST /api/ranking` proxy

## Meta-rules
1. Before any task: check `.claude/commands/` for a relevant command file.
2. After creating a command: add it to the commands table below.
3. After non-trivial task: check if `.claude/docs/learnings/` needs a new note.
4. **Question-only mode:** If the message starts with `question:` or `answer me:`, only answer - do NOT edit any files or run any commands.
5. **Changelog:** After card data or feature changes, add entry to `content/changelog.mdx`. Use `/add-changelog`. Card/feature scope only - no UI or page structure changes. See `.claude/docs/changelog.md` for purpose, rules, tone, and format guide.

## Custom commands

| Command               | File                             | Purpose                                                                        |
|-----------------------|----------------------------------|--------------------------------------------------------------------------------|
| `/write-post`         | `commands/write-post.md`         | Write a new blog post                                                          |
| `/generate-images`    | `commands/generate-images.md`    | Add images to blog posts + Gemini prompts                                      |
| `/add-json-ld`        | `commands/add-json-ld.md`        | Add JSON-LD structured data to a page                                          |
| `/add-changelog`      | `commands/add-changelog.md`      | Add a changelog entry                                                          |
| `/persona-page`       | `commands/persona-page.md`       | Create or update persona page (scaffold + intro + FAQs from live API data)     |
| `/create-story`       | `commands/create-story.md`       | Create Storybook story for a component                                         |
| `/add-ow-ui`          | `commands/add-ow-ui.md`          | Move component to `ow-ui/`, rename to `Ow*`, create story, report usages       |
| `/commit-all`         | `commands/commit-all.md`         | Stage + commit all changes in logical groups with conventional commit messages |
| `/sync-api-types`     | `commands/sync-api-types.md`     | Regenerate types from API schema, diff changes, scan codebase, suggest updates |
| `/edit-system-prompt` | `commands/edit-system-prompt.md` | Edit Owie's system prompt, enforce invariants, push to Langfuse                |

@.claude/docs/openwallet-brain.md
@.claude/docs/architecture.md
@.claude/DESIGN.md
@.claude/docs/chat.md
