# Auth + DB Plan: Neon Auth + Neon Postgres

## Context

OpenWallet needs user accounts to:

1. Gate paid AI model (first 100 users get free paid access, dev pays)
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
  output_tokens_per_credit: 1000,  // output 4x more expensive
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
  ('early_adopter', 'Early Adopter', true,  'First 100 signups'),
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
-- signup_number <= 100 → tier = 'early_adopter', else 'free'
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

## Anonymous ID → Auth ID

Update `getUserId()` in `lib/chat/anonymous-user.ts`:

```ts
export function getUserId(): string {
  const authUserId = useUserStore.getState().user?.id
  if (authUserId) return authUserId
  // fallback: anon localStorage ID
  ...
}
```

Called from `chat-runtime.tsx:76`. Past anon traces in Langfuse stay anonymous — acceptable.

---

## Model selector behavior

- One OW-curated paid model (hardcoded after testing)
- Selector shows: `[OW Pick: <model name>]` + free models
- Paid model item disabled when `!canUsePaidModel || isOutOfCredits`
- Tooltip on disabled: "Hết credit"
- Server rejects paid model if no credits (safety net, not primary UX)
- Free models always available regardless of credit balance

---

## Phase 0: Auth + DB Setup [ ]

**Goal:** Sign in with Google or GitHub. User row created on first login.

- [ ] Neon MCP: `provision_neon_auth` on project `steep-voice-40755571`
- [ ] `pnpm add @neondatabase/auth @neondatabase/serverless`
- [ ] Add env vars: `NEON_AUTH_BASE_URL`, `AUTH_SECRET`, `DATABASE_URL`
- [ ] Run full DB migration (SQL above)
- [ ] Create `lib/auth/server.ts` — Neon Auth server client
- [ ] Create `app/api/auth/[...path]/route.ts` — auth handler
- [ ] Create `lib/neon-db.ts` (server-only) — Postgres client + user/tier queries
- [ ] On-first-login: insert `users` row, assign tier by `signup_number`
- [ ] Create `lib/credits.ts` — `CREDIT_CONVERSION` config + `tokensToCreditCost()`
- [ ] Create `lib/stores/user-store.ts` — Zustand store
- [ ] Create `components/auth/user-store-provider.tsx`
- [ ] Update `app/layout.tsx` — wrap with `UserStoreProvider`
- [ ] Update `lib/chat/anonymous-user.ts` — `getUserId()` checks auth store first
- [ ] Create `components/auth/sign-in-button.tsx`
- [ ] Create `components/auth/user-menu.tsx` (credit balance inside)
- [ ] Add `UserMenu` to header

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

## Verification

1. Sign in with Google → row in `users` with `signup_number` from sequence
2. 101st signup → `tier = 'free'`, `can_use_paid_model = false`
3. SQL: `UPDATE users SET tier = 'early_adopter'` → paid model unlocks in selector
4. `bonus_credits = 0` → paid model disabled in selector, free models still work
5. Redeem 100%-off voucher → `bonus_credits` increments → paid model re-enables
6. Send message with paid model → `credit_usage_log` row + `bonus_credits` decrements
7. Free model message → `credit_usage_log` row with `credits_used = 0`
8. Sign out → `getUserId()` returns anon localStorage ID
9. Langfuse: signed-in traces tagged with Neon Auth user ID
