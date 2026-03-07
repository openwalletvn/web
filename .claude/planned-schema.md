# OpenWallet User Service — Data Schema

Status legend: ✅ Live · 🔮 Planned

---

## ✅ reminders (Live — migration 0001)

Server-side. Each row = one scheduled notification.

### D1 SQL

```sql
CREATE TABLE reminders (
  id               TEXT PRIMARY KEY,
  wallet_id        TEXT NOT NULL,
  account_id       TEXT,                -- nullable, links to accounts when sync enabled
  adapter          TEXT NOT NULL,       -- 'discord' | 'telegram' | 'email' | 'zalo'
  credential       TEXT NOT NULL,       -- AES-256-GCM encrypted
  credential_hash  TEXT NOT NULL,       -- SHA-256, used for limit enforcement
  fire_on_day      INTEGER NOT NULL,    -- 1-31
  days_before      INTEGER NOT NULL,    -- 0 = same day, 1 = day before, etc.
  message          TEXT NOT NULL,       -- pre-built client-side, Vietnamese
  last_status      TEXT DEFAULT 'pending',  -- 'pending' | 'sent' | 'failed'
  last_sent_at     TEXT,               -- ISO timestamp of last send attempt
  last_sent_date   TEXT,               -- YYYY-MM-DD dedup guard
  fail_reason      TEXT,
  expires_at       TEXT NOT NULL,       -- 6-month TTL, auto-cleanup
  created_at       TEXT NOT NULL
);
CREATE INDEX idx_reminders_fire_on_day ON reminders(fire_on_day);
CREATE INDEX idx_reminders_credential_hash ON reminders(credential_hash);
CREATE INDEX idx_reminders_wallet_id ON reminders(wallet_id);
```

### TypeScript

```ts
interface Reminder {
  id: string;
  wallet_id: string;
  account_id?: string;
  adapter: string;
  credential: string;
  credential_hash: string;
  fire_on_day: number;
  days_before: number;
  message: string;
  last_status: string;
  last_sent_at?: string;
  last_sent_date?: string;
  fail_reason?: string;
  expires_at: string;
  created_at: string;
}
```

### Example row

```json
{
  "id": "rem_a1b2c3d4",
  "wallet_id": "wal_x9y8z7",
  "account_id": null,
  "adapter": "discord",
  "credential": "enc:aes256gcm:...",
  "credential_hash": "sha256:7f3a...",
  "fire_on_day": 13,
  "days_before": 2,
  "message": "💳 Visa Techcombank — đến hạn thanh toán sau 2 ngày (ngày 15)",
  "last_status": "sent",
  "last_sent_at": "2026-03-05T01:00:12Z",
  "last_sent_date": "2026-03-05",
  "fail_reason": null,
  "expires_at": "2026-09-05T01:00:00Z",
  "created_at": "2026-03-01T08:30:00Z"
}
```

---

## ✅ delivery_logs (Live — migration 0002)

Server-side. Audit trail for every send attempt. Cleaned weekly (kept 30 days).

### D1 SQL

```sql
CREATE TABLE delivery_logs (
  id           TEXT PRIMARY KEY,
  reminder_id  TEXT NOT NULL,
  adapter      TEXT NOT NULL,
  status       TEXT NOT NULL,       -- 'sent' | 'failed'
  fail_reason  TEXT,
  sent_at      TEXT NOT NULL
);
CREATE INDEX idx_logs_sent_at ON delivery_logs(sent_at);
CREATE INDEX idx_logs_reminder_id ON delivery_logs(reminder_id);
```

### TypeScript

```ts
interface DeliveryLog {
  id: string;
  reminder_id: string;
  adapter: string;
  status: string;
  fail_reason?: string;
  sent_at: string;
}
```

### Example row

```json
{
  "id": "log_m1n2o3",
  "reminder_id": "rem_a1b2c3d4",
  "adapter": "discord",
  "status": "sent",
  "fail_reason": null,
  "sent_at": "2026-03-05T01:00:12Z"
}
```

---

## 🔮 accounts (Planned — Phase 5: Auth + Sync)

Server-side. Created only when user explicitly opts in to sync.

### D1 SQL

```sql
CREATE TABLE accounts (
  id              TEXT PRIMARY KEY,    -- UUID
  email           TEXT NOT NULL UNIQUE,
  created_at      TEXT NOT NULL,
  last_login_at   TEXT,
  early_adopter   INTEGER DEFAULT 0,   -- 1 if among first 500 sync users
  pro_reason      TEXT,                -- 'paid' | 'early_adopter' | 'promo'
  sync_enabled    INTEGER DEFAULT 1    -- always 1 at creation (user opted in)
);
CREATE INDEX idx_accounts_email ON accounts(email);
```

### TypeScript

```ts
interface Account {
  id: string;
  email: string;
  created_at: string;
  last_login_at?: string;
  early_adopter: boolean;
  pro_reason?: 'paid' | 'early_adopter' | 'promo';
  sync_enabled: boolean;
}
```

### Example row

```json
{
  "id": "acc_f4e5d6c7",
  "email": "phuc@openwallet.vn",
  "created_at": "2026-03-01T08:00:00Z",
  "last_login_at": "2026-03-07T02:15:00Z",
  "early_adopter": true,
  "pro_reason": "early_adopter",
  "sync_enabled": true
}
```

### Notes

- Auth via magic link (Resend email), no password
- JWT stored client-side in IndexedDB, verified by Worker
- First 500 sync users → `early_adopter = true`, `pro_reason = 'early_adopter'`
- Once grandfathered, always grandfathered

---

## 🔮 wallets (Planned — Phase 5: Auth + Sync)

Server-side. Synced wallet metadata. One user can have multiple wallets.

### D1 SQL

```sql
CREATE TABLE wallets (
  id              TEXT PRIMARY KEY,    -- matches client-side wallet ID
  account_id      TEXT NOT NULL,
  name            TEXT NOT NULL,       -- user-given wallet name
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
CREATE INDEX idx_wallets_account_id ON wallets(account_id);
```

### TypeScript

```ts
interface Wallet {
  id: string;
  account_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
```

### Example row

```json
{
  "id": "wal_x9y8z7",
  "account_id": "acc_f4e5d6c7",
  "name": "Ví chính",
  "created_at": "2026-03-01T08:00:00Z",
  "updated_at": "2026-03-05T10:00:00Z"
}
```

---

## 🔮 wallet_cards (Planned — Phase 5: Auth + Sync)

Server-side. Synced card metadata — no sensitive financial data (no card numbers, no credit limits).

### D1 SQL

```sql
CREATE TABLE wallet_cards (
  id                TEXT PRIMARY KEY,   -- matches client-side card ID
  wallet_id         TEXT NOT NULL,
  card_name         TEXT NOT NULL,      -- e.g. "Visa Platinum"
  bank_slug         TEXT NOT NULL,      -- e.g. "techcombank", matches card catalog
  statement_day     INTEGER,           -- 1-31, nullable (user may not have set it)
  payment_due_day   INTEGER,           -- 1-31, nullable
  notify_statement  INTEGER DEFAULT 0, -- 1 = enabled
  notify_due        INTEGER DEFAULT 0, -- 1 = enabled
  notify_days_before INTEGER DEFAULT 1,-- days before event to notify
  notify_adapter    TEXT,              -- 'discord' | 'telegram' | 'email'
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);
CREATE INDEX idx_wallet_cards_wallet_id ON wallet_cards(wallet_id);
```

### TypeScript

```ts
interface WalletCard {
  id: string;
  wallet_id: string;
  card_name: string;
  bank_slug: string;
  statement_day?: number;
  payment_due_day?: number;
  notify_statement: boolean;
  notify_due: boolean;
  notify_days_before: number;
  notify_adapter?: 'discord' | 'telegram' | 'email' | 'zalo';
  created_at: string;
  updated_at: string;
}
```

### Example row

```json
{
  "id": "card_k1l2m3",
  "wallet_id": "wal_x9y8z7",
  "card_name": "Visa Platinum",
  "bank_slug": "techcombank",
  "statement_day": 5,
  "payment_due_day": 15,
  "notify_statement": false,
  "notify_due": true,
  "notify_days_before": 2,
  "notify_adapter": "discord",
  "created_at": "2026-03-01T08:30:00Z",
  "updated_at": "2026-03-05T10:00:00Z"
}
```

### What is NOT stored server-side (ever)

- Card numbers or last 4 digits
- Credit limits or outstanding balances
- Transaction history
- Any raw financial data

---

## Relationship diagram

```
accounts (🔮)
  │
  ├── 1:N → wallets (🔮)
  │           │
  │           └── 1:N → wallet_cards (🔮)
  │
  └── 1:N → reminders (✅, linked via account_id when sync enabled)
                │
                └── 1:N → delivery_logs (✅)
```

## Migration path

The `reminders` table already has `account_id TEXT` (nullable) — no schema change needed when sync launches. Future migrations:

- `0003_accounts.sql` — CREATE TABLE accounts
- `0004_wallets.sql` — CREATE TABLE wallets
- `0005_wallet_cards.sql` — CREATE TABLE wallet_cards

All additive. No existing table alterations. No breaking changes.
