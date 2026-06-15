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

## Phase 0: Auth + DB Setup [ ]

**Goal:** Magic-link email sign-in. User row created on first login.

### 1. Neon Auth config (via Neon MCP)
- [ ] Enable magic link: `configure_neon_auth` → `update_auth_methods`, set magic link `expires_in: 900` (15 min in seconds)
- [ ] Disable email/password: `configure_neon_auth` → `update_auth_methods` → `email_password.enabled: false`
- [ ] Remove Google OAuth: `configure_neon_auth` → `remove_oauth_provider` → `google`
- [ ] Add trusted origin: `configure_neon_auth` → `add_trusted_origin` → `https://openwallet.vn`
- [ ] `allow_localhost` already true — no action needed

### 2. Packages
- [ ] `pnpm add better-auth @neondatabase/serverless`
  - **NOT** `@neondatabase/auth` (doesn't exist) — Neon Auth IS Better Auth, use `better-auth` directly
  - `@neondatabase/serverless` for the Postgres client
  - Install `better-auth@latest` (currently 1.6.x) — check release notes before pinning, magic link plugin API may differ from `0.x` docs online

### 3. Env vars
- [ ] Add to `.env.local` + Vercel:
  ```
  # Better Auth (Neon Auth)
  BETTER_AUTH_URL=https://openwallet.vn              # prod; localhost:3000 for local
  BETTER_AUTH_SECRET=<random 32+ char string>
  NEXT_PUBLIC_BETTER_AUTH_URL=https://openwallet.vn  # public, client-side

  # Neon DB
  DATABASE_URL=<direct connection string>             # NOT pooled — auth ops use direct
  DATABASE_URL_POOL=<pooled connection string>        # for read-heavy queries
  ```

### 4. DB migration
- [ ] Run full schema SQL via Neon MCP `run_sql` on branch `production`
- [ ] `neon_auth.user.id` is UUID — store as `TEXT` in `public.users`, insert with `id = neon_auth_user_id::text`
- [ ] Add `updated_at` trigger (auto-sets on UPDATE — don't rely on app-level):
  ```sql
  CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS trigger AS $$
  BEGIN NEW.updated_at = now(); RETURN NEW; END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  ```
- [ ] Assign tier atomically at INSERT via DB trigger (avoids race: two concurrent signups both reading count ≤ 20):
  ```sql
  CREATE OR REPLACE FUNCTION assign_tier_on_signup()
  RETURNS trigger AS $$
  BEGIN
    IF NEW.signup_number <= 20 THEN
      NEW.tier := 'early_adopter';
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER users_assign_tier
    BEFORE INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION assign_tier_on_signup();
  ```
- [ ] Wrap every query in `lib/neon-db.ts` that touches `user_cards` with session var for RLS:
  ```sql
  SET LOCAL app.current_user_id = '<user_id>';
  SELECT * FROM user_cards WHERE ...;
  ```
  Use `withUserContext(userId, fn)` helper. Otherwise RLS blocks all queries.

### 5. Auth wiring
- [ ] Create `lib/auth/server.ts`:
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

- [ ] Create `lib/auth/client.ts`:
  ```ts
  import { createAuthClient } from 'better-auth/client'
  import { magicLinkClient } from 'better-auth/client/plugins'

  export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [magicLinkClient()],
  })
  ```

- [ ] Create `app/api/auth/[...path]/route.ts`:
  ```ts
  import { auth } from '@/lib/auth/server'
  import { toNextJsHandler } from 'better-auth/next-js'
  export const { GET, POST } = toNextJsHandler(auth)
  ```
  > Verify no existing `app/api/auth/` route before creating. Remove any pre-existing one.

- [ ] Create `proxy.ts` at project root (Next.js 16 preferred name over `middleware.ts`):
  ```ts
  // proxy.ts — stub, no routes protected yet
  import { NextResponse } from 'next/server'
  import type { NextRequest } from 'next/server'
  export function proxy(req: NextRequest) { return NextResponse.next() }
  export const config = { matcher: [] }  // extend as needed
  ```

### 6. DB queries (`lib/neon-db.ts`, server-only)
- [ ] Add `'server-only'` import at top — prevents accidental client bundle inclusion
- [ ] Postgres client using `@neondatabase/serverless` with `DATABASE_URL` (direct)
  > Use `neon()` tagged template for one-off reads, `Pool` in `betterAuth` config. Don't mix patterns.
- [ ] `insertUserRow(id, email, name)` — called from Better Auth hook:
  ```ts
  await sql`
    INSERT INTO users (id, email, display_name)
    VALUES (${id}, ${email}, ${name})
    ON CONFLICT (id) DO NOTHING
  `
  ```
- [ ] `getUserFromDb(id)` — returns full user row incl. `tier`, `bonus_credits`, `trace_id`
- [ ] `getTier(tierId)` — returns tier row (`can_use_paid_model` etc.)
- [ ] `withUserContext(userId, fn)` — wraps queries needing RLS:
  ```ts
  async function withUserContext<T>(userId: string, fn: () => Promise<T>): Promise<T> {
    return sql.begin(async (tx) => {
      await tx`SET LOCAL app.current_user_id = ${userId}`
      return fn()  // fn uses tx, not global sql
    })
  }
  ```

### 7. Credits config
- [ ] Create `lib/credits.ts` — unchanged from plan

### 8. User state (Zustand)
- [ ] Create `lib/stores/user-store.ts`:
  ```ts
  interface UserStore {
    user: AuthUser | null
    tier: string
    canUsePaidModel: boolean
    bonusCredits: number
    traceId: string | null       // pseudonymous Langfuse ID
    isOutOfCredits: boolean
    isLoaded: boolean            // false until client hydration done
    setUser: (user, dbData, tierData) => void
  }
  // isLoaded starts false; set true inside setUser after hydration
  ```
- [ ] Create `components/auth/user-store-provider.tsx` — call `setUser` in `useEffect`, not directly from server props, to avoid hydration mismatch
- [ ] Zustand v5 requires `createStore` + context for SSR-safe providers (avoids shared singleton between requests). Use `createStore` in provider, not global `create()`. See `lib/use-compare-list.ts` for existing pattern.

### 9. App restructure
- [ ] Move `app/(chat)/chat/` → `app/(app)/(chat)/chat/` (URL `/chat` unchanged)
- [ ] Delete `app/(chat)/layout.tsx` after move (currently just wraps in `ow-chat-layout` div — move that class into `(app)/layout.tsx` or `chat-page-client.tsx`)
- [ ] Create `app/(app)/layout.tsx` — shared sidebar shell:
  ```tsx
  // server component: read session + db user, pass to UserStoreProvider
  // auth.api.getSession from lib/auth/server.ts; headers() from next/headers — must be awaited
  const session = await auth.api.getSession({ headers: await headers() })
  const dbUser = session ? await getUserFromDb(session.user.id) : null
  const tierData = dbUser ? await getTier(dbUser.tier) : null

  return (
    <UserStoreProvider initialUser={session} initialDbUser={dbUser} initialTier={tierData}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </UserStoreProvider>
  )
  ```
- [ ] Refactor `chat-page-client.tsx`:
  - Remove `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter` — move to `AppSidebar`
  - Keep only `SidebarInset` inner content (header bar + `ChatRuntime`)
  - Conversation list (`convos`, `activeId`, handlers) — expose via `useChatSidebarStore` so `AppSidebar` can render it
  - `(app)/layout.tsx` provides `SidebarProvider` — `chat-page-client.tsx` must NOT have its own (double-nesting breaks sidebar state)
- [ ] Create `app/(app)/account/page.tsx` — `if (!session) redirect('/auth/sign-in?next=/account')`
- [ ] Create `app/(app)/wallet/layout.tsx` — `notFound()` placeholder
- [ ] Add redirect `/app/*` → `/wallet` in `next.config.ts`

### 10. Auth UI
- [ ] Create `app/(auth)/layout.tsx` — minimal centered layout, no sidebar
- [ ] Create `app/(auth)/auth/sign-in/page.tsx`:
  ```tsx
  // await before redirecting — show error in UI if it throws (e.g. rate limit)
  await authClient.signIn.magicLink({ email, callbackURL: '/chat' })
  // then redirect to /auth/verify
  ```
  > `callbackURL: '/chat'` is relative — Better Auth resolves against `baseURL`. In dev, verify this works; if not, pass full URL: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/chat`.
- [ ] Create `app/(auth)/auth/verify/page.tsx` — "check your email" static screen

### 11. App sidebar (`components/app/app-sidebar.tsx`)
- [ ] Create `components/app/app-sidebar.tsx` — replaces inline sidebar in `chat-page-client.tsx`:
  - `SidebarHeader`: logo + new chat button (visible on all pages)
  - `SidebarContent`: nav links (Home, Chat, Account) + conversation list (from `useChatSidebarStore`, only populated when on `/chat`)
  - `SidebarFooter`: `UserMenu` (avatar, credits, sign out)
- [ ] Create `lib/stores/chat-sidebar-store.ts` — Zustand store: `convos`, `activeId`, `selectConvo`, `deleteConvo` — populated by chat page, read by `AppSidebar`
  > Chat page populates store in `useEffect`. `AppSidebar` renders before that fires — guard with empty state, shows no convos until effect runs. Correct behavior.
- [ ] Create `components/auth/user-menu.tsx` — avatar, name, credit balance, sign out:
  ```tsx
  await authClient.signOut()
  router.push('/')
  ```

### 12. Langfuse trace ID
- [ ] Update `lib/chat/anonymous-user.ts` — `getUserId()` client-only:
  ```ts
  export function getUserId(): string {
    if (typeof window === 'undefined') return 'anon-ssr'  // client-only guard
    const traceId = useUserStore.getState().traceId
    if (traceId) return traceId
    // fallback: localStorage anon ID
    ...
  }
  ```
  > If `useUserStore` uses context pattern (Zustand v5 SSR), `getState()` won't work outside React tree. Instead export a module-level ref the provider writes to on mount: `export let traceIdRef: string | null = null`. `getUserId()` reads `traceIdRef`.
- [ ] Add `traceId` to `UserStore` — populated from `users.trace_id` in `getUserFromDb()`

### 13. Chat route: integrate userId from session
- [ ] `app/api/chat/route.ts` — server reads session, never trusts body for credit authority:
  ```ts
  // userId from request body is client-controlled — untrusted for credit deduction
  const session = await auth.api.getSession({ headers: req.headers })
  const userId = session?.user.id ?? body.userId  // fallback to anon for unauthenticated
  ```

### 14. Privacy policy
- [ ] Update `app/(marketing)/(legal)/chinh-sach-bao-mat/page.tsx` — clarify Langfuse receives pseudonymous `trace_id` only, not email/auth ID

---

## Phase 1: Paid Model Selection [ ]

**Goal:** `can_use_paid_model` tier flag + credit balance gates paid model access.

- [ ] Add paid model entry to `CHAT_MODELS` in `lib/chat/models.ts` — add `paid: true` flag (not just `free: false`) so server can identify it unambiguously
- [ ] Hardcode OW-curated paid model ID in config after testing
- [ ] `app/api/chat/route.ts` — server-side check: reject paid model if `!canUsePaidModel || bonusCredits === 0`
  - Read session → query `getUserFromDb` + `getTier`
  - DB query per request adds latency — accept for now (sub-50ms on Neon), optimize later if needed
- [ ] Model selector UI — paid model item disabled + tooltip when ineligible

---

## Phase 2: Credit Tracking [ ]

**Goal:** Deduct credits on paid model messages. Log all messages.

- [ ] `lib/neon-db.ts` — add `getUserCredits()`, `deductCredits()`
- [ ] `app/api/chat/route.ts` `onFinish`:
  - `deductCredits()` using `tokensToCreditCost()` (paid model only)
  - log to `credit_usage_log` (all models, `credits_used = 0` for free)
  - Use `after()` from `next/server` (already imported) for fire-and-forget DB writes — ensures credit deduction runs even on client disconnect
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
15. Client disconnect mid-stream → credit still deducted (via `after()`)
16. Two simultaneous signups at user #20 → only one gets `early_adopter` (DB trigger atomic)
17. Paid model request with no session → rejected server-side (not just UI-disabled)
