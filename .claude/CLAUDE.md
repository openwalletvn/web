# OpenWallet

Vietnamese-first web app: public card-comparison site (SEO, SSR/SSG on Vercel) + private wallet app (IndexedDB).

**Base URL:** `https://openwallet.vn` | **API:** `https://api.openwallet.vn/api/v1/`

## Local repo layout

Three sibling repos share the same parent folder:

| Repo | Relative path from this repo |
|------|------------------------------|
| web (this) | `.` |
| api | `../api` |
| mcp | `../mcp` |

When asked to "edit local api repo" → work in `../api`. "edit local mcp repo" → work in `../mcp`.

## Commands
- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Validate posts: `pnpm validate:posts`
- Admin server: `pnpm admin`

## Core principles
1. **Vercel deployment** — SSR/SSG via Vercel. Dynamic routes allowed. Data fetched at build time where possible.
2. **Local-first** — wallet data in IndexedDB via Dexie.js. No server accounts.
3. **Vietnamese-first** — UI/content targets Vietnamese users. Technical terms stay English.
4. **SEO-first** — every public page has JSON-LD, OG metadata, sitemap entries.

## Component conventions
- Every component's wrapper element **must** have a class name matching its filename, prefixed with `ow-`.
- Pattern: `ow-<filename-kebab-case>` → e.g. `post-card.tsx` → `ow-post-card`, `card-image.tsx` → `ow-card-image`.
- Prepend to existing `className` string. No new wrapper elements.
- Purpose: identify components in browser DevTools inspector.

## Layout & CSS rules
See `@.claude/docs/layout.md` for container conventions and CSS/typography rules.

## API authentication
- Always use `apiFetch()` from `lib/api.ts` — auto-injects `X-OpenWallet-Key` header.
- Never use `NEXT_PUBLIC_` prefix for `OPENWALLET_API_KEY` — server-only build secret.
- Never use raw `fetch()` for API calls. Pass only path: `apiFetch('/api/v1/cards')`.

## Blog content rules
- **Categories** (exactly 4): `Review the`, `Huong dan`, `Tin tuc`, `So sanh the`
- **Frontmatter required**: title, description, date, category, tags, status
- **Headings**: `##`, `###`, `####` only (no `#`). Auto-TOC generated.
- **Images**: `/public/images/posts/<slug>/<filename>.webp`

## Writing rules
- **No em dashes (—):** Never use em dashes in any page content or metadata. Replace with a comma, colon, parentheses, or restructure the sentence. Em dashes are a visible AI writing signal.
- **Tone for public pages:** Professional and honest, not corporate or casual. Use "chúng tôi" consistently. Avoid overly informal phrasing.

## Chat feature status

- **Chat button hidden** — `ChatToggleButton` removed from `components/layout/header.tsx` (both desktop + mobile). Do not re-add unless explicitly requested.
- **`/app` not indexed** — `public/robots.txt` has `Disallow: /app`. Keep this. The wallet app is local-first and should never be crawled.

## Card ranking

**Single source of truth: `lib/card-ranker.ts`** — ranking factors and priority order documented in the JSDoc above `rankCards()`.

Supporting files: `lib/cashback-calc.ts` (cashback estimation), `components/marketing/card-ranking-table.tsx` (UI with spend selector).

## Meta-rules
1. Before any task: check `.claude/commands/` for a relevant command file.
2. After creating a command: add it to the commands table below.
3. After non-trivial task: check if `.claude/docs/learnings/` needs a new note.
4. **Question-only mode:** If the message starts with `question:` or `answer me:`, only answer — do NOT edit any files or run any commands.
5. **Changelog:** After card data or feature changes, add entry to `content/changelog.mdx`. Use `/add-changelog`. Card/feature scope only — no UI or page structure changes. See `.claude/docs/changelog.md` for purpose, rules, tone, and format guide.

## Custom commands

| Command | File | Purpose |
|---------|------|---------|
| `/write-post` | `commands/write-post.md` | Write a new blog post |
| `/generate-images` | `commands/generate-images.md` | Add images to blog posts + Gemini prompts |
| `/add-json-ld` | `commands/add-json-ld.md` | Add JSON-LD structured data to a page |
| `/add-changelog` | `commands/add-changelog.md` | Add a changelog entry |

@.claude/docs/architecture.md
@.claude/docs/layout.md
