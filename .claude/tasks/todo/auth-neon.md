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

Stack: Next.js App Router on Vercel + Hono CF Worker API (no DB). Adding Neon for both auth and Postgres.

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
  id TEXT PRIMARY KEY,              -- = neon_auth.users.id
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
  isOutOfCredits: boolean   // bonusCredits === 0
  isLoaded: boolean
  setUser: (user: AuthUser | null, dbData: UserDbRow | null, tierData: TierRow | null) => void
}
```

Provider in `app/layout.tsx`:

```tsx
const session = await getServerSession()
const dbUser = session ? await getUserFromDb(session.id) : null
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
  (auth)/                               ← minimal layout, no shell
    layout.tsx
    auth/
      sign-in/page.tsx                  ← /auth/sign-in — email input, calls magicLink()
      verify/page.tsx                   ← /auth/verify — "check your email" static screen
  (shell)/                              ← shared AppShell (nav/header), NO auth gate
    layout.tsx                          ← UserStoreProvider + AppShell; session may be null
    chat/page.tsx                       ← /chat — public, always works
    account/page.tsx                    ← /account — self-redirects to /auth/sign-in if no session
    wallet/                             ← /wallet — TBD, not implemented yet
      layout.tsx                        ← notFound() until decided
  api/
    auth/[...path]/route.ts             ← Neon Auth handler
    chat/route.ts                       ← existing
  layout.tsx                            ← root: fonts, analytics only
```

**Auth model:**
- `/chat` — public, no auth required; auth = optional upgrade (unlocks paid model)
- `/account` — self-guards: `if (!session) redirect('/auth/sign-in?next=/account')`
- `/wallet` — TBD
- `proxy.ts` middleware — no routes protected globally; add per-route as needed

**Routes:**

| Feature | URL | Notes |
|---|---|---|
| Chat | `/chat` | moved from `app/(chat)/chat/`, URL unchanged |
| Account | `/account` | new |
| Wallet | `/wallet` | TBD; redirect `/app/*` → `/wallet` in `next.config.ts` |
| Sign in | `/auth/sign-in` | magic link only, no password |
| Verify | `/auth/verify` | static "check your email" screen |

---

## Phase 0: Auth + DB Setup [ ]

**Goal:** Magic-link email sign-in. User row created on first login.

### Neon Auth config
- [ ] Neon MCP: enable magic link plugin (`expires_in: 15`, `disable_sign_up: false`)
- [ ] Neon MCP: disable `email_password` auth method
- [ ] Neon MCP: remove Google OAuth provider

### Packages + env
- [ ] `pnpm add @neondatabase/auth @neondatabase/serverless`
- [ ] Add env vars: `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `DATABASE_URL`

### DB
- [ ] Run full DB migration (SQL above)

### Auth wiring
- [ ] Create `lib/auth/server.ts` — `createNeonAuth` server instance
- [ ] Create `lib/auth/client.ts` — `createAuthClient` client instance
- [ ] Create `app/api/auth/[...path]/route.ts` — auth handler (`auth.handler()`)
- [ ] Create `proxy.ts` — middleware stub (no protected routes yet, ready to extend)

### DB queries
- [ ] Create `lib/neon-db.ts` (server-only) — Postgres client + `getUserFromDb()`, `getTier()`
- [ ] On-first-login hook: insert `users` row, assign tier by `signup_number`

### Credits config
- [ ] Create `lib/credits.ts` — `CREDIT_CONVERSION` config + `tokensToCreditCost()`

### User state
- [ ] Create `lib/stores/user-store.ts` — Zustand store (user, tier, bonusCredits, traceId, isLoaded)
- [ ] Create `components/auth/user-store-provider.tsx`

### App restructure
- [ ] Move `app/(chat)/chat/` → `app/(shell)/chat/` (URL `/chat` unchanged)
- [ ] Create `app/(shell)/layout.tsx` — reads session + dbUser, wraps `UserStoreProvider` + `AppShell`
- [ ] Create `app/(shell)/account/page.tsx` — self-redirects if no session
- [ ] Create `app/(shell)/wallet/layout.tsx` — `notFound()` placeholder
- [ ] Add redirect `/app/*` → `/wallet` in `next.config.ts`

### Auth UI
- [ ] Create `app/(auth)/layout.tsx` — minimal centered layout
- [ ] Create `app/(auth)/auth/sign-in/page.tsx` — email input + `authClient.signIn.magicLink()`
- [ ] Create `app/(auth)/auth/verify/page.tsx` — "check your email" static screen

### Shell + nav
- [ ] Create `components/shell/app-shell.tsx` — nav sidebar (desktop) + bottom bar (mobile)
- [ ] Nav items: Chat always visible; Account shows if session exists else Sign in link
- [ ] Create `components/auth/user-menu.tsx` — avatar, name, credit balance, sign out

### Langfuse trace ID
- [ ] Update `lib/chat/anonymous-user.ts` — `getUserId()` returns `trace_id` (logged-in) or localStorage anon ID (guest)
- [ ] Add `traceId` to `UserStore` — populated from `users.trace_id` via `getUserFromDb()`

### Privacy policy
- [ ] Update `app/(marketing)/(legal)/chinh-sach-bao-mat/page.tsx` — clarify Langfuse receives pseudonymous `trace_id` only, not email/auth ID

---

## Phase 1: Paid Model Selection [ ]

**Goal:** `can_use_paid_model` tier flag + credit balance gates paid model access.

- [ ] Hardcode OW-curated paid model ID in config after testing
- [ ] `app/api/chat/route.ts` — server-side check: reject paid model if `!canUsePaidModel || bonusCredits === 0`
- [ ] Model selector UI — paid model item disabled + tooltip when ineligible

---

## Phase 2: Credit Tracking [ ]

**Goal:** Deduct credits on paid model messages. Log all messages.

- [ ] `lib/neon-db.ts` — add `getUserCredits()`, `deductCredits()`
- [ ] `app/api/chat/route.ts` `onFinish`:
  - `deductCredits()` using `tokensToCreditCost()` (paid model only)
  - log to `credit_usage_log` (all models, `credits_used = 0` for free)
- [ ] Credit balance display in `UserMenu`

---

## Phase 3: Packages + Vouchers [ ]

**Goal:** Admin creates voucher codes. Users apply at checkout to get credits.

- [ ] Seed `packages` table
- [ ] `app/api/vouchers/redeem/route.ts` — validate + redeem → insert `credit_topups` + increment `bonus_credits`
- [ ] Voucher input UI (simple code field)
- [ ] Payment gateway wired later — `payment_id` + `payment_provider` nullable, zero migration

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
