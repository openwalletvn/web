# Auth + DB Plan: Neon Auth + Neon Postgres

## Context

OpenWallet needs user accounts to:

1. Gate paid AI model (first 20 users get free paid access, dev pays)
2. Track per-user credit balance
3. Store user's saved card IDs (feed to Owie for personalized responses)

Currently: zero auth, zero DB, all anonymous. Chat uses OpenRouter via `app/api/chat/route.ts`. Models defined in
`lib/chat/models.ts`. Anonymous user ID lives in `lib/chat/anonymous-user.ts` (localStorage, stable per browser) —
already has comment `// Replace with auth userId when auth lands.`. Zustand v5 already installed and used (
`lib/use-compare-list.ts`). Wallet cards in IndexedDB (local, stays local).

Stack: Next.js 16.2.6 App Router on Vercel + Hono CF Worker API (no DB). Adding Neon for both auth and Postgres.

---

## Credit System

**Credits = stable external unit. Tokens = internal implementation detail.**

- Free models → zero credit cost, no limit, usage still logged for analytics
- Paid model → deducts `bonus_credits` per message
- Credits never expire, never reset

Formula lives in `lib/credits.ts` (config only, not DB):

```ts
// lib/credits.ts
export const CREDIT_CONVERSION = {
  input_tokens_per_credit: 4000,
  output_tokens_per_credit: 1000,
}

export function tokensToCreditCost(input: number, output: number): number {
  return input / CREDIT_CONVERSION.input_tokens_per_credit
       + output / CREDIT_CONVERSION.output_tokens_per_credit
}
```

Formula change → update config only → past `credits_used` rows untouched → packages/vouchers/balances unaffected.

**Out of credits:** `bonus_credits === 0` → paid model disabled in selector. Free models always available.

**Paid model = one OW-curated model** (hardcoded after testing). Model selector shows `[OW Pick: <model name>]` + free
models. When out of credits → paid model item disabled + tooltip "Hết credit". Server rejects as safety net only.

---

## Credit Economics (finalized 2026-06-15)

### Real usage data (from `logs/` — 9 turns across 3 convos)

```
Avg input/turn:  7,664 tokens  (system prompt ~7k dominates)
Avg output/turn:    299 tokens
Credits/turn: 7664/4000 + 299/1000 = 1.916 + 0.299 = ~2.2 credits
Cost/turn at base model: ~$0.005
```

### Starter pack: 50k VND ≈ $2

```
500 credits / 2.2 credits per msg = ~225 messages = ~22 convos (10 msg avg)
```

### ROI by model (225 msg/pack)

| Model | $/1M in | $/1M out | Cost/msg | 225msg cost | ROI |
|---|---|---|---|---|---|
| Gemini 2.5 Flash Lite | $0.10 | $0.40 | $0.00089 | $0.20 | **904%** |
| Gemini 3.1 Flash Lite | $0.25 | $1.50 | $0.00236 | $0.53 | **276%** |
| Gemini 2.5 Flash | $0.30 | $2.50 | $0.00305 | $0.69 | **192%** |
| Gemini 3 Flash Preview | $0.50 | $3.00 | $0.00473 | $1.06 | **88%** |
| Gemini 2.5 Pro | $1.25 | $10.00 | $0.01257 | $2.83 | **-29%** ❌ |

**Min ROI target: 60%** (max cost $1.25 per $2 pack)

**Current pick: Gemini 2.5 Flash** (`google/gemini-2.5-flash`) → 192% ROI, strong quality.

### Mental model

ROI slider = model quality knob. More expensive model → better answers → lower ROI. Switch model anytime — zero schema changes. Stay above 60% floor.

```
Gemini 2.5 Flash Lite  → 276% ROI  (cheapest)
Gemini 2.5 Flash       → 192% ROI  ← current pick
Gemini 3 Flash         →  88% ROI  (premium feel)
[floor]                →  60% ROI  ($1.25 max cost/pack)
```

### TODO: internal ROI tool

Build simple internal page/script: input model prices → outputs cost/msg, cost/pack, ROI. Needed for quick model-switch decisions. Not urgent — add to backlog.

---

## DB Schema (full)

```sql
-- Credit formula (config only, NOT in DB — lives in lib/credits.ts)
-- 1 credit = 4000 input tokens OR 1000 output tokens

-- Tiers: access control only, no credit limits
CREATE TABLE tiers (
  id TEXT PRIMARY KEY,                     -- 'free' | 'early_adopter' | 'pro' | 'unlimited'
  label TEXT NOT NULL,
  can_use_paid_model BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO tiers VALUES
  ('free',          'Free',          false, 'Basic users'),
  ('early_adopter', 'Early Adopter', true,  'First 20 signups'),
  ('pro',           'Pro',           true,  'Paid users'),
  ('unlimited',     'Unlimited',     true,  'Dev / internal');

-- Users
CREATE SEQUENCE user_signup_seq;

CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- = neon_auth.users.id (UUID stored as TEXT)
  email TEXT,
  display_name TEXT,
  tier TEXT DEFAULT 'free' REFERENCES tiers(id),
  signup_number INTEGER DEFAULT nextval('user_signup_seq'),
  bonus_credits NUMERIC(12,4) DEFAULT 0,  -- purchased/voucher balance, persistent, never expires
  trace_id UUID DEFAULT gen_random_uuid() UNIQUE, -- pseudonymous ID sent to Langfuse (no PII)
  preferences JSONB DEFAULT '{}',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User saved cards
CREATE TABLE user_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, card_id)
);

-- Credit usage log (one row per chat message)
-- Free models: credits_used = 0, still logged for analytics
-- Paid model: credits_used computed from tokensToCreditCost()
CREATE TABLE credit_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id),
  model_id TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  credits_used NUMERIC(10,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Packages: what you sell (credits, not tokens)
CREATE TABLE packages (
  id TEXT PRIMARY KEY,              -- 'starter_100' | 'pro_500'
  label TEXT NOT NULL,
  price INTEGER NOT NULL,           -- VND, 0 = free
  credit_amount INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vouchers: discount codes (applied at checkout)
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,      -- 'percent' | 'fixed'
  discount_value INTEGER NOT NULL,  -- 100 = 100% off | 50000 = 50,000 VND off
  max_redemptions INTEGER DEFAULT 1,
  redeemed_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE voucher_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID REFERENCES vouchers(id),
  user_id TEXT REFERENCES users(id),
  redeemed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(voucher_id, user_id)       -- prevent double redeem
);

-- All credit grants (purchase or voucher)
CREATE TABLE credit_topups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id),
  package_id TEXT REFERENCES packages(id),
  credits_granted INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL,            -- VND actually charged after discount
  voucher_id UUID REFERENCES vouchers(id), -- nullable
  payment_id TEXT,                         -- nullable now, filled when gateway lands
  payment_provider TEXT,                   -- nullable now: 'payos' | 'vnpay' etc
  status TEXT DEFAULT 'pending',           -- 'pending' | 'completed' | 'failed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log for tier/permission changes
CREATE TABLE user_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id),
  action TEXT,           -- 'tier_changed' | 'account_deleted' etc
  old_value JSONB,
  new_value JSONB,
  changed_by TEXT,       -- admin user_id or 'system'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS on user_cards
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_cards_isolation ON user_cards
  USING (user_id = current_setting('app.current_user_id', true));
```

Tier assignment on first login:

```sql
-- signup_number <= 20 → tier = 'early_adopter', else 'free'
```

---

## User state architecture (Zustand)

```
Server (RSC) → reads Neon Auth session cookie → passes user to client
Client → Zustand store useUserStore → available everywhere, no prop drilling
```

```ts
// lib/stores/user-store.ts
interface UserStore {
  user: AuthUser | null
  tier: string              // 'free' | 'early_adopter' | 'pro' | 'unlimited'
  canUsePaidModel: boolean
  bonusCredits: number      // persistent balance
  traceId: string | null    // pseudonymous ID for Langfuse, never PII
  isOutOfCredits: boolean   // bonusCredits === 0
  isLoaded: boolean
  setUser: (user: AuthUser | null, dbData: UserDbRow | null, tierData: TierRow | null) => void
}
```

Provider in `app/(app)/layout.tsx`:

```tsx
const session = await auth.api.getSession({ headers: await headers() })
const dbUser = session ? await getUserFromDb(session.user.id) : null
const tierData = dbUser ? await getTier(dbUser.tier) : null
<UserStoreProvider
  initialUser={session}
  initialDbUser={dbUser}
  initialTier={tierData}
>
  {children}
</UserStoreProvider>
```

---

## Anonymous ID → Trace ID (Langfuse)

**Privacy policy:** Langfuse receives `trace_id` (random UUID), never auth ID or email. Pseudonymous — no third party can identify user. OpenWallet team can reverse `trace_id → email` via DB if needed for abuse/legal, but never exposed in dashboards by default.

Update `getUserId()` in `lib/chat/anonymous-user.ts`:

```ts
export function getUserId(): string {
  const traceId = useUserStore.getState().traceId  // users.trace_id from DB
  if (traceId) return traceId
  // fallback: anon localStorage ID (unauthenticated)
  ...
}
```

Called from `chat-runtime.tsx:76`. Past anon traces in Langfuse stay as localStorage IDs — acceptable. On login, future traces use stable `trace_id`.

Add `traceId: string | null` to `UserStore` interface. Populate from `users.trace_id` in `getUserFromDb()`.

**Admin policy:** never join `trace_id → email` in public dashboards. Lookup only with documented reason.

---

## Model selector behavior

- One OW-curated paid model (hardcoded after testing)
- Selector shows: `[OW Pick: <model name>]` + free models
- Paid model item disabled when `!canUsePaidModel || isOutOfCredits`
- Tooltip on disabled: "Hết credit"
- Server rejects paid model if no credits (safety net, not primary UX)
- Free models always available regardless of credit balance

---

## App Structure

```
app/
  (marketing)/                          ← public SEO pages, no auth, existing
  (auth)/                               ← minimal layout, no app sidebar
    layout.tsx
    auth/
      sign-in/page.tsx                  ← /auth/sign-in — email input, calls magicLink()
      verify/page.tsx                   ← /auth/verify — "check your email" static screen
  (app)/                                ← shared app sidebar (shadcn Sidebar), NO auth gate
    layout.tsx                          ← UserStoreProvider + SidebarProvider + AppSidebar
    (chat)/
      chat/page.tsx                     ← /chat — public, always works (moved from current (chat)/)
    account/page.tsx                    ← /account — self-redirects to /auth/sign-in if no session
    wallet/                             ← /wallet — TBD, not implemented yet
      layout.tsx                        ← notFound() until decided
  api/
    auth/[...path]/route.ts             ← Better Auth handler (replaces any Neon Auth handler)
    chat/route.ts                       ← existing — add credit check in Phase 1
  layout.tsx                            ← root: fonts, analytics (NO UserStoreProvider here)
```

**Current state:** Chat lives in `app/(chat)/chat/`. Must move to `app/(app)/(chat)/chat/`. URL stays `/chat`.

**Root layout (`app/layout.tsx`) change:** Currently wraps `ChatProvider` + `ChatPanel` + `OwOwieFab`. These stay in root layout — they're marketing-page overlays. `UserStoreProvider` goes in `(app)/layout.tsx` only, NOT root layout (avoids DB reads on marketing pages).

**Sidebar architecture:**
- ONE sidebar across chat/account/wallet — shadcn `Sidebar` lifted to `(app)/layout.tsx`
- `chat-page-client.tsx` currently owns `SidebarProvider` + `Sidebar` — must strip these out
- Conversation list state moves to `useChatSidebarStore` (Zustand) so `AppSidebar` can render it
- `chat-page-client.tsx` keeps only `SidebarInset` inner content (header bar + `ChatRuntime`)

**Auth model:**
- `/chat` — public, no auth required; auth = optional upgrade (unlocks paid model)
- `/account` — self-guards: `if (!session) redirect('/auth/sign-in?next=/account')`
- `/wallet` — TBD
- `proxy.ts` — no routes protected globally; add per-route as needed

**Routes:**

| Feature | URL | Notes |
|---|---|---|
| Chat | `/chat` | moves to `app/(app)/(chat)/chat/` — URL unchanged |
| Account | `/account` | new |
| Wallet | `/wallet` | TBD; redirect `/app/*` → `/wallet` in `next.config.ts` |
| Sign in | `/auth/sign-in` | magic link only, no password |
| Verify | `/auth/verify` | static "check your email" screen |

---

## Pre-flight: What's Already Done (verified via Neon MCP 2026-06-15)

- Neon project: `steep-voice-40755571` (region: `aws-ap-southeast-1`, pg v18)
- Neon Auth: provisioned on branch `production` (`br-noisy-cloud-aoac1ag3`)
- Better Auth schema (`neon_auth.*`): tables `user`, `session`, `account`, `verification`, `jwks`, `member`, `organization`, `invitation`, `project_config` all exist
- Email provider: Neon shared SMTP (`auth@mail.myneon.app`) — **no Resend/custom SMTP needed**
- `neon_auth.user.id` type: **UUID** — `users.id TEXT` stores it cast as text
- `allow_localhost: true` already set
- Google OAuth currently enabled (shared, no custom client) — disable per plan
- `email_password` currently enabled — disable per plan
- Magic link: NOT yet enabled — must add via `configure_neon_auth`
- Trusted origins: empty — must add `https://openwallet.vn`

---

## Phase 0: Auth + DB Setup [x]

**Goal:** Magic-link email sign-in. User row created on first login.

### 1. Neon Auth config (via Neon MCP)
- [x] Enable magic link: handled via `magicLink()` plugin in `lib/auth/server.ts` (MCP tool doesn't support magic_link key directly)
- [x] Disable email/password: `configure_neon_auth` → `update_auth_methods` → `email_password.enabled: false`
- [x] Remove Google OAuth: `configure_neon_auth` → `remove_oauth_provider` → `google`
- [x] Add trusted origin: `configure_neon_auth` → `add_trusted_origin` → `https://openwallet.vn`
- [x] `allow_localhost` already true — no action needed

### 2. Packages
- [x] `pnpm add better-auth @neondatabase/serverless`
  - **NOT** `@neondatabase/auth` (doesn't exist) — Neon Auth IS Better Auth, use `better-auth` directly
  - `@neondatabase/serverless` for the Postgres client
  - Install `better-auth@latest` (currently 1.6.x) — check release notes before pinning, magic link plugin API may differ from `0.x` docs online

### 3. Env vars
- [x] Add to `.env.local` + Vercel:
  ```
  # Better Auth (Neon Auth)
  BETTER_AUTH_URL=https://openwallet.vn              # prod; localhost:3000 for local
  BETTER_AUTH_SECRET=<random 32+ char string>
  NEXT_PUBLIC_BETTER_AUTH_URL=https://openwallet.vn  # public, client-side

  # Neon DB
  DATABASE_URL=<direct connection string>             # NOT pooled — auth ops use direct
  DATABASE_URL_POOL=<pooled connection string>        # for read-heavy queries
  ```
  > `.env.local` done. Vercel env vars still pending — must add before deploying.

### 4. DB migration
- [x] Run full schema SQL via Neon MCP `run_sql_transaction` on production branch
  > `run_sql` rejected multi-statement; switched to `run_sql_transaction` with array of individual SQL strings
- [x] Users stored with Better Auth UUID as TEXT primary key; `insertUserRow` in `lib/neon-db.ts` called from `databaseHooks.user.create.after`
- [x] `set_updated_at` trigger applied — auto-updates `users.updated_at` on every UPDATE
- [x] `assign_tier_on_signup` trigger applied — atomically sets `tier = 'early_adopter'` for `signup_number <= 20`
- [x] `withUserContext(userId, fn)` in `lib/neon-db.ts` — uses `Pool`, gets client, BEGIN → SET LOCAL → fn(pool) → COMMIT/ROLLBACK
  > Plan spec used `neon().begin()` API which doesn't exist on `NeonQueryFunction`; implemented with explicit `client.query()` calls instead

### 5. Auth wiring
- [x] Create `lib/auth/server.ts`:
  ```ts
  import { betterAuth } from 'better-auth'
  import { magicLink } from 'better-auth/plugins'
  import { Pool } from '@neondatabase/serverless'

  export const auth = betterAuth({
    database: new Pool({ connectionString: process.env.DATABASE_URL }),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          // Neon shared SMTP sends automatically — leave as no-op or log
          console.log('[magic-link]', email, url)
        },
        expiresIn: 900,   // 15 min
        disableSignUp: false,
      }),
    ],
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            // fires once per new user, server-side, before response returns — no race
            await insertUserRow(user.id, user.email, user.name)
          },
        },
      },
    },
  })
  ```
  > `insertUserRow` imported from `lib/neon-db.ts`. `neon-db.ts` must NOT import from `lib/auth/server.ts` — no circular deps.

- [x] Create `lib/auth/client.ts`:
  ```ts
  import { createAuthClient } from 'better-auth/client'
  import { magicLinkClient } from 'better-auth/client/plugins'

  export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [magicLinkClient()],
  })
  ```

- [x] Create `app/api/auth/[...path]/route.ts`:
  ```ts
  import { auth } from '@/lib/auth/server'
  import { toNextJsHandler } from 'better-auth/next-js'
  export const { GET, POST } = toNextJsHandler(auth)
  ```
  > Verify no existing `app/api/auth/` route before creating. Remove any pre-existing one.

- [x] Create `proxy.ts` at project root (Next.js 16 preferred name over `middleware.ts`):
  ```ts
  // proxy.ts — stub, no routes protected yet
  import { NextResponse } from 'next/server'
  import type { NextRequest } from 'next/server'
  export function proxy(req: NextRequest) { return NextResponse.next() }
  export const config = { matcher: [] }  // extend as needed
  ```

### 6. DB queries (`lib/neon-db.ts`, server-only)
- [x] `'server-only'` import at top
- [x] `neon()` tagged template for reads, `Pool` for `withUserContext` and `betterAuth` config
- [x] `insertUserRow`, `getUserFromDb`, `getTier`, `withUserContext` all implemented
  > `withUserContext` uses `Pool` + `client.query()` (not `neon().begin()` — that API doesn't exist)

### 7. Credits config
- [x] Create `lib/credits.ts` — `CREDIT_CONVERSION` + `tokensToCreditCost()`, unchanged from plan

### 8. User state (Zustand)
- [x] Create `lib/stores/user-store.ts` — `createStore` + `UserStoreContext` + `useUserStore` hook (SSR-safe, no global singleton)
  - `AuthUser`, `UserStore` interfaces; `traceId = { current: null }` module-level mutable ref for non-React access
  > Plan proposed `export let traceIdRef` — module namespace exports are read-only when mutated externally; fixed with object ref pattern
- [x] Create `components/auth/user-store-provider.tsx` — `setUser` in `useEffect`, `traceId.current` set from `initialDbUser.trace_id`
- [x] Create `lib/stores/chat-sidebar-store.ts` — global `create()` (client-only safe): `convos`, `activeId`, `setConvos`, `setActiveId`

### 9. App restructure
- [x] `app/(chat)/chat/` → `app/(app)/(chat)/chat/` → `app/(app)/chat/` (redundant `(chat)` group removed; URL `/chat` unchanged)
- [x] `app/(chat)/layout.tsx` deleted
- [x] `app/(app)/layout.tsx` created — server component reads session + DB user + tier, wraps in `UserStoreProvider` → `SidebarProvider` → `AppSidebar` + children
- [x] `chat-page-client.tsx` refactored — removed all sidebar components, populates `useChatSidebarStore` via useEffect, renders only `SidebarInset` content
- [x] `app/(app)/account/page.tsx` created — redirects to `/auth/sign-in?next=/account` if no session
- [x] `app/(app)/wallet/layout.tsx` created — `notFound()` placeholder
- [x] `/app/:path*` → `/wallet` redirect added to `next.config.ts`

### 10. Auth UI
- [x] Create `app/(auth)/layout.tsx` — minimal centered layout, no sidebar
- [x] Create `app/(auth)/auth/sign-in/page.tsx` — email input → `authClient.signIn.magicLink({ email, callbackURL: '/chat' })` → redirect to `/auth/verify`; error displayed inline on throw
- [x] Create `app/(auth)/auth/verify/page.tsx` — static "check your email" screen

### 11. App sidebar (`components/app/app-sidebar.tsx`)
- [x] Create `components/app/app-sidebar.tsx` — sidebar-04 style: header (logo + new-chat action), persistent convo list grouped by day, `SidebarRail`, `collapsible="icon"`; hydrates chat store on mount so history shows on all `(app)` routes
- [x] `lib/stores/chat-sidebar-store.ts` created (done in step 8)
- [x] Create `components/auth/user-menu.tsx` — `UserMenuSidebarFooter`: avatar row with `DropdownMenu` (account + sign out); legacy `UserMenu` kept as deprecated export
- [x] Add `components/app/app-shell.tsx` — `SidebarInset` + header with `headerLeft`/`headerRight` slots; used by `/chat` and `/account`
- [x] Install shadcn `avatar` + `dropdown-menu` components

### 12. Langfuse trace ID
- [x] `lib/chat/anonymous-user.ts` — `getUserId()` reads `traceId.current` (module-level object ref) if set, else falls back to localStorage anon ID; SSR guard returns `'anon-ssr'`
  > Plan suggested `export let traceIdRef` — read-only module export; fixed with `export const traceId = { current: null }` object ref
- [x] `traceId` in `UserStore`; `traceId.current` set by `UserStoreProvider` on mount from `initialDbUser.trace_id`

### 13. Chat route: integrate userId from session
- [x] `app/api/chat/route.ts` reads session at handler start; `traceUserId = dbUser?.trace_id ?? body.userId`; `propagateAttributes` uses `traceUserId`

### 14. Privacy policy
- [ ] Update `app/(marketing)/(legal)/chinh-sach-bao-mat/page.tsx` — pending; clarify Langfuse receives pseudonymous `trace_id` only, not email/auth ID

---

## Phase 1: Paid Model Selection [x]

**Goal:** `can_use_paid_model` tier flag + credit balance gates paid model access.

- [x] Add paid model entry to `CHAT_MODELS` in `lib/chat/models.ts` — added `paid: true` flag; model ID inlined as string (no exported constant needed — use `CHAT_MODELS.find(m => m.paid)?.id` to get it)
- [x] Hardcode OW-curated paid model: `google/gemini-2.5-flash` (192% ROI) — change `id` in `CHAT_MODELS` paid entry to switch model; zero schema changes
- [x] `app/api/chat/route.ts` — server-side check: reject paid model if `!canUsePaidModel || bonusCredits === 0` (403 + Vietnamese error message)
- [x] Model selector UI — `composer.tsx` reads `useUserStore` → `canUsePaidModel` + `isOutOfCredits` → paid model item `disabled` + description "Hết credit"; auto-falls back to default model if paid model becomes unavailable

---

## Phase 2: Credit Tracking [x]

**Goal:** Deduct credits on paid model messages. Log all messages.

- [x] `lib/neon-db.ts` — added `logCreditUsage()` + `deductCredits()` (GREATEST(0, ...) prevents negative balance)
- [x] `app/api/chat/route.ts` `onFinish`:
  - `tokensToCreditCost()` for paid model; `0` for free
  - `after()` wraps both `logCreditUsage` + `deductCredits` — fire-and-forget, survives client disconnect
  - logs to `credit_usage_log` for all models
- [x] Credit balance display in `UserMenuSidebarFooter` — already shows `bonusCredits` from Zustand store (was done in Phase 0)

---

## Phase 3: Vouchers (no payment gateway) [ ]

**Goal:** Admin creates 100%-off voucher codes. Users redeem to get credits. No payment gateway needed.

> Payment gateway is out of scope until further notice. Voucher redemption is the only way to grant credits pre-payment.

- [ ] `app/api/vouchers/redeem/route.ts` — POST `{ code }` → validate voucher (`vouchers` table) → check `max_redemptions` + `expires_at` → insert `voucher_redemptions` + insert `credit_topups` + `UPDATE users SET bonus_credits = bonus_credits + X`
- [ ] Voucher input UI — simple text field + submit button (e.g. on `/account` page)
- [ ] Admin: create vouchers via direct SQL (`INSERT INTO vouchers ...`) — no admin UI needed yet

---

## Tier management (no admin UI needed)

Change tier: `UPDATE users SET tier = 'early_adopter' WHERE id = '...'`
Grant credits: create 100%-off voucher → user redeems
Audit trail: write to `user_audit_log` on tier changes

---

## Out of scope (for now)

- Wallet card sync UI (`user_cards` table ready)
- Payment gateway integration (schema ready: `payment_id`, `payment_provider` nullable)
- Admin dashboard
- Credit expiry

---

## Phase 4: Announcement [ ]

**Goal:** Blog post announcing first-100-users early adopter campaign, published after auth is live.

- [ ] Create blog post in category `Thong bao` (create category if none exists)
  - Title: announce the first 20 users get free paid AI model access (early adopter campaign)
  - Content: what Owie is, what the campaign offers, how to sign up, what happens after 20 users
  - Use `/write-post` command
- [ ] Verify category `Thong bao` appears in blog listing

---

## Verification

1. `/chat` loads without login → free models work, paid model disabled
2. Enter email at `/auth/sign-in` → redirect to `/auth/verify` → email arrives
3. Click magic link → session created → redirect to `/chat`
4. `/account` while logged in → shows profile + credits
5. `/account` while logged out → redirects to `/auth/sign-in?next=/account`
6. First 20 signups → `tier = 'early_adopter'`, `can_use_paid_model = true`
7. 21st signup → `tier = 'free'`, `can_use_paid_model = false`
8. SQL: `UPDATE users SET tier = 'early_adopter'` → paid model unlocks in selector
9. `bonus_credits = 0` → paid model disabled in selector, free models still work
10. Redeem 100%-off voucher → `bonus_credits` increments → paid model re-enables
11. Send message with paid model → `credit_usage_log` row + `bonus_credits` decrements
12. Free model message → `credit_usage_log` row with `credits_used = 0`
13. Sign out → `getUserId()` returns anon localStorage ID
14. Langfuse: signed-in traces use `users.trace_id`, not email/auth ID
15. Client disconnect mid-stream → credit still deducted (via `after()`)
16. Two simultaneous signups at user #20 → only one gets `early_adopter` (DB trigger atomic)
17. Paid model request with no session → rejected server-side (not just UI-disabled)
