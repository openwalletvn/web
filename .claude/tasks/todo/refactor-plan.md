# OpenWallet Web: Refactor & Consolidation Plan

Status: In progress | Started: 2026-05-29

---

## Context

API just finished mass cleanup + stabilized. Core API features: rank endpoints, persona system.
Web codebase has old features, mixed components, duplicated UI across features.

**Features and status:**
| Feature | Status | Notes |
|---------|--------|-------|
| Card Match | Done (data+rank) | UI incomplete, waiting designer |
| Card Compare / Battle | Data ready from API | UI needs update |
| OpenWallet Chat | API+MCP ready | Needs evals, system prompt, more testing |
| OpenWallet MCP | Public, dev mode | Fine as-is, low usage |
| Wallet App (`/app/app/`) | **Frozen** | Competitor shipped it, ROI low - revisit later |
| SEO Persona Pages | Partial | Hardcoded, not driven by API personas |

---

## Phase 0: Triage & Archive
**Goal:** Remove noise. Nothing new can be built cleanly until dead code is gone.

- [x] Delete `_draft/` folder - 18 dead intent category pages, zero references in codebase
- [x] Gate `/app/app/*` wallet routes - `app/app/layout.tsx` calls `notFound()` unless `WALLET_ENABLED=true`; shell in `app/app/app-shell.tsx`
- [x] Update `CLAUDE.md` - documented frozen wallet, chat gate, so-sanh-404-redirect purpose

---

## Phase 1: Design System SSOT
**Goal:** Single reference doc so LLMs + devs pick right component every time. No new feature ships duplicate UI.

- [ ] Create `.claude/docs/design-system.md` - the LLM reference doc:
  - Card variant usage rules (`card-tile` = grid, `card-row` = list, `card-slim` = compact, `card-inline` = inline embed)
  - Badge component map (when to use NetworkBadge vs CardTypeBadge vs BankDisplay)
  - Page layout templates (marketing shell vs app shell vs blog shell)
  - Color/spacing token names from CSS vars
- [ ] Consolidate 5 card display variants → `<CardDisplay variant="tile|row|slim|inline" />`
  - Kill: `card-inline.tsx`, `card-row.tsx`, `card-slim.tsx`, `card-tile.tsx` as separate files
  - Single file: `components/cards/variants/card-display.tsx`
- [ ] Consolidate 6 badge/display components → consistent naming
  - `NetworkBadge`, `CardTypeBadge`, `BankBadge`, `ContactlessBadge`
  - All in `components/shared/badges/`
- [ ] Add missing primitives to `components/ui/`:
  - `text.tsx` - typography primitive with variant prop
  - `heading.tsx` - h1-h4 with size variant
  - `stack.tsx` - flex layout primitive (replaces raw div+flex)

---

## Phase 2: Feature Module Cleanup
**Goal:** One folder per domain. Clear component responsibility. No hidden duplication.

- [ ] Reorganize `components/` into clean domain folders:
  ```
  components/
  ├── ui/          (primitives - already good, add Text/Heading/Stack)
  ├── shared/      (cross-domain: badges, bank display - consolidate here)
  ├── cards/       (keep, but merge variants into single CardDisplay)
  ├── compare/     (reduce 10 → 3 components)
  ├── match/       (rename/move from marketing/card-match-finder)
  ├── chat/        (keep as-is)
  ├── blog/        (keep as-is)
  ├── layout/      (keep as-is)
  └── wallet/      (keep as-is - frozen but organized)
  ```
- [ ] Reduce compare feature: 10 components → 3
  - `CompareBar` - state management + card selection UI
  - `CompareTable` - display only
  - `CompareCard` - individual card in comparison
  - Delete: `compare-template.tsx` (inline logic into CompareBar), `record-compare-visit.tsx` (inline into CompareBar)
- [ ] Split `card-form-dialog.tsx` (23.5K) - already partially split in `wallet/add/`
  - Use `BankSelectionStep`, `CardSelectionStep`, `PaymentMethodStep` as composition
  - Wrapper stays, but delegates to step components
- [ ] Split `card-detail-form.tsx` (18.8K) same pattern

---

## Phase 3: SEO / Persona Consolidation
**Goal:** Data-driven SEO pages. Personas from API → pages. No hardcoded links.

- [ ] Audit persona list from API - call `getPersonas()`, document all slugs + intents
- [ ] Create dynamic route `app/(marketing)/the/[persona-slug]/page.tsx`
  - Replaces 14 hardcoded `the-*` pages
  - Each page: persona data + ranked cards by persona from API
  - generateStaticParams → build all persona pages at build time (SSG)
- [ ] Update `featured-card-categories.tsx` → pull from personas API, not hardcoded
- [ ] Define firm SEO page list in `CLAUDE.md` - which personas get dedicated pages + sitemap

### Deprecated SEO collection pages (404 - restore when Phase 3 done)
These old URLs were indexed by Google, now 404. Need canonical redirects or page revival:

| Old URL | Was | Redirect target (Phase 3) |
|---|---|---|
| `/the-tin-dung` | Credit card listing | persona slug TBD |
| `/the-tin-dung-visa` | Visa credit cards | persona slug TBD |
| `/the-ghi-no` | Debit card listing | persona slug TBD |
| `/the-tin-dung-phi-thuong-nien-thap` | Low annual fee | persona slug TBD |
| `/cards/credit` | Old credit listing | → `/the` (interim) |
| `/cards/debit` | Old debit listing | → `/the` (interim) |
| `/cards/visa` | Old Visa listing | → `/the` (interim) |
| `/cards/mastercard` | Old MC listing | → `/the` (interim) |
| `/cards/amex` | Old Amex listing | → `/the-tin-dung-amex` or `/the` |
| `/cards/jcb` | Old JCB listing | → `/the` (interim) |
| `/cards/napas` | Old NAPAS listing | → `/the` (interim) |
| `/cards/unionpay` | Old UnionPay listing | → `/the` (interim) |
| `/cards/2in1` | Old 2-in-1 listing | → `/the-2-trong-1` or `/the` |
| `/cards/networks/*` | Old network filter pages | → `/the` (interim) |
| `/cards/co-branded/*` | Old co-branded pages | → `/the` (interim) |
| `/cards` | Old card index | → `/the` |
| `/banks` | Old bank index | → `/ngan-hang` |
| `/blog` | Old blog index | → `/tin-tuc` |

**Interim fix needed in `next.config.ts`:** Current `/cards/:slug*` redirect sends `/cards/credit` → `/the/credit` (404). Need specific rules for category paths before the generic slug rule.

---

## Phase 4: Chat / MCP Release Readiness
**Goal:** Get chat to a releasable state. Not blocking other phases.

- [ ] Write 10+ eval test cases in `evals/` for chat system prompt
- [ ] Write + iterate system prompt based on eval scores
- [ ] Gate chat behind feature flag until eval pass rate hits threshold
- [ ] MCP: no action needed now (dev mode, low usage, fine as-is)

---

## Phase 5: Card Battle UI Update
**Depends on: Phase 1 complete**
**Goal:** Update compare/battle UI using consolidated components + design tokens.

- [ ] Redesign compare page using new `CardDisplay`, `CompareTable`, unified tokens
- [ ] Update card battle `[pair]` page - same design system
- [ ] Add persona-aware suggestions to compare flow (API ready)

---

## What NOT to touch (yet)

- `components/wallet/` internals - frozen feature
- `lib/api.ts` - clean, centralized, leave alone
- Chat components - wait for evals
- Card detail page sections - working, low priority
- `so-sanh-404-redirect.tsx` - active, handles legacy URL redirects

---

## Files to reference before any card/UI task

- `.claude/docs/design-system.md` (create in Phase 1)
- `components/ui/` - check here first before creating new primitives
- `lib/api.ts` - types + fetch wrappers
- `components/cards/variants/card-display.tsx` (after Phase 1)
