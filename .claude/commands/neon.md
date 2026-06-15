# Neon DB

Interact with the OpenWallet Neon Postgres database using the Neon MCP tools.

## Project constants

| Key | Value |
|-----|-------|
| `projectId` | `steep-voice-40755571` |
| `branchId` (production) | `br-noisy-cloud-aoac1ag3` |
| `databaseName` | `neondb` |

Always pass these when calling Neon MCP tools unless a temporary branch is active.

## Rules

1. **Never run destructive SQL autonomously.** DROP, DELETE, TRUNCATE, UPDATE without WHERE — always show the statement and ask for confirmation first.
2. **Schema changes go through a temp branch.** Use `prepare_database_migration` → verify on temp branch → `complete_database_migration`. Never ALTER/CREATE directly on production.
3. **Reads are always safe.** SELECT, EXPLAIN, describe_table_schema, get_database_tables — run freely.
4. **Trigger/function changes** are DDL — use migration flow, not bare `run_sql`.
5. **Backfills** (UPDATE on existing rows) — show statement + expected row count, confirm before running.

## Workflow: schema migration

```
1. prepare_database_migration  → creates temp branch, applies SQL, returns migrationId + tempBranchId
2. run_sql (tempBranchId)      → verify change looks correct
3. ask user: "Apply to production?"
4. complete_database_migration → applies to production branch, deletes temp branch
```

## Workflow: query / read

```
run_sql(projectId, sql)   — no branchId needed for production reads
```

## Workflow: trigger / function update

Same as schema migration. Example — updating `assign_tier_on_signup()`:

```sql
CREATE OR REPLACE FUNCTION assign_tier_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.signup_number <= 20 THEN
        NEW.tier := 'early_adopter';
        NEW.bonus_credits := 500;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Show the new function body, confirm, then run via `run_sql_transaction`.

## Workflow: backfill

Show the UPDATE + a SELECT to preview affected rows first:

```sql
-- preview
SELECT id, email, signup_number FROM users WHERE signup_number <= 20;

-- then run after confirmation
UPDATE users SET bonus_credits = 500 WHERE signup_number <= 20;
```

## Useful queries

```sql
-- all users
SELECT id, email, tier, signup_number, bonus_credits, created_at FROM users ORDER BY signup_number;

-- check triggers on a table
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- check trigger function body
SELECT prosrc FROM pg_proc WHERE proname = 'assign_tier_on_signup';

-- table list
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## Key tables

| Table | Purpose |
|-------|---------|
| `users` | Auth user + tier + credits. `signup_number` auto-increments. `trace_id` is pseudonymous Langfuse ID. |
| `tiers` | `free`, `early_adopter`, `pro`, `unlimited` — controls `can_use_paid_model` |
| `credit_usage_log` | Per-message token cost log |
| `credit_topups` | Purchase/voucher credit grants |

## Never do

- `run_sql` with multiple statements — use `run_sql_transaction` with an array instead
- Read cross-repo data files (`../api/lib/generated-*.json`) — use `apiFetch()` from the web app
- Commit `.env.local` or any file containing `DATABASE_URL`
