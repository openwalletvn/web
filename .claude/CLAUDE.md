# OpenWallet

Vietnamese-first web app: public card-comparison site (SEO, static export) + private wallet app (IndexedDB).

**Base URL:** `https://openwallet.vn` | **API:** `https://api.openwallet.vn/api/v1/`

## Commands
- Dev: `pnpm dev`
- Build: `pnpm build` (static export)
- Lint: `pnpm lint`
- Validate posts: `pnpm validate:posts`
- Admin server: `pnpm admin`

## Core principles
1. **Static export** — `output: 'export'`. No server runtime. All data fetched at build time.
2. **Local-first** — wallet data in IndexedDB via Dexie.js. No server accounts.
3. **Vietnamese-first** — UI/content targets Vietnamese users. Technical terms stay English.
4. **SEO-first** — every public page has JSON-LD, OG metadata, sitemap entries.

## Component conventions
- Every component's wrapper element **must** have a class name matching its filename, prefixed with `ow-`.
- Pattern: `ow-<filename-kebab-case>` → e.g. `post-card.tsx` → `ow-post-card`, `card-image.tsx` → `ow-card-image`.
- Prepend to existing `className` string. No new wrapper elements.
- Purpose: identify components in browser DevTools inspector.

## CSS & typography rules
- **Typography source of truth:** `app/typography.css` — all text styles live here (h1–h6 base + utility classes).
- **No hardcoded styles:** Never write hardcoded `font-size`, `font-weight`, `line-height`, `letter-spacing` values in components or inline styles. Always use an existing class from `app/typography.css`. If no class fits, stop and ask for approval before adding one.
- **`globals.css` scope:** Variables and tokens only (`@theme`, `:root`, `@layer base` for non-typography resets). Typography belongs in `app/typography.css`.
- **After any CSS/layout change:** Re-read these rules and confirm nothing violates them.
- **Responsive layout:** Every component must be checked for mobile/tablet/desktop breakpoints. Never ship a layout change without verifying responsive behavior.

## API authentication
- Always use `apiFetch()` from `lib/api.ts` — auto-injects `X-OpenWallet-Key` header.
- Never use `NEXT_PUBLIC_` prefix for `OPENWALLET_API_KEY` — server-only build secret.
- Never use raw `fetch()` for API calls. Pass only path: `apiFetch('/api/v1/cards')`.

## Blog content rules
- **Categories** (exactly 4): `Review the`, `Huong dan`, `Tin tuc`, `So sanh the`
- **Frontmatter required**: title, description, date, category, tags, status
- **Headings**: `##`, `###`, `####` only (no `#`). Auto-TOC generated.
- **Images**: `/public/images/posts/<slug>/<filename>.webp`

## Meta-rules
1. Before any task: check `.claude/commands/` for a relevant command file.
2. After creating a command: add it to the commands table below.
3. After non-trivial task: check if `.claude/docs/learnings/` needs a new note.
4. **Question-only mode:** If the message starts with `question:` or `answer me:`, only answer — do NOT edit any files or run any commands.

## Custom commands

| Command | File | Purpose |
|---------|------|---------|
| `/write-post` | `commands/write-post.md` | Write a new blog post |
| `/generate-images` | `commands/generate-images.md` | Add images to blog posts + Gemini prompts |
| `/add-json-ld` | `commands/add-json-ld.md` | Add JSON-LD structured data to a page |
| `/add-changelog` | `commands/add-changelog.md` | Add a changelog entry |

@.claude/docs/architecture.md
