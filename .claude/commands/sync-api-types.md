# Sync API Types

Pull latest OpenAPI schema from the API, regenerate TypeScript types, diff the changes, and suggest codebase updates.

## Steps

### 1. Snapshot current types

Before regenerating, capture the current state of `lib/api-types.generated.ts` for diffing:

```bash
cp lib/api-types.generated.ts /tmp/api-types.before.ts
```

### 2. Regenerate types

```bash
pnpm generate:types
```

If this fails (missing env vars, API unreachable), stop and report the error clearly.

### 3. Diff the schema changes

```bash
diff /tmp/api-types.before.ts lib/api-types.generated.ts
```

Parse the diff and extract structured changes per schema:

- **Added fields** - `+` lines inside a schema block
- **Removed fields** - `-` lines inside a schema block
- **New schemas** - entire new `SchemaName: {` blocks
- **Removed schemas** - entire deleted blocks
- **Changed types** - field type changed (e.g. `string` → `string | null`)

Report changes grouped by schema name. Example format:

```
Bank:
  + group?: string          (new optional field)
  - legacy_code?: string    (removed)

Card:
  ~ annual_fee: number → number | null   (now nullable)
```

### 4. Scan codebase for affected usages

For each changed schema, grep all usages across the codebase (excluding `node_modules`, `lib/api-types.generated.ts` itself, `.next`):

```bash
grep -rn "\.group\b\|bank\.group\|Bank\b" \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules --exclude-dir=.next \
  .
```

For **removed fields**: find all usages → these are definite breakages, must fix.
For **added optional fields**: find relevant components → suggest where to surface the new data.
For **type changes** (e.g. now nullable): find usages that assume non-null → flag for null-safety.

### 5. Suggest specific updates

For each finding, output a concrete suggestion. Example:

**`Bank.group` added (optional `string`)**
- `components/ow-ui/ow-bank-row.tsx` - consider displaying group badge if `bank.group` is set
- `components/ow-ui/ow-bank-image.tsx` - no action needed (image-only component)
- `app/ngan-hang/[id]/page.tsx` - consider adding group to bank detail metadata
- `components/cards/cards-filter.tsx` - consider grouping bank filter options by `group`

**`Bank.legacy_code` removed**
- `lib/some-util.ts:42` - accesses `bank.legacy_code`, will TypeScript error → remove or replace

### 6. Type-check

```bash
pnpm exec tsc --noEmit 2>&1 | head -60
```

Report any new type errors introduced by the schema changes. These are highest priority fixes.

### 7. Summary

Output final summary:

```
Schema changes: N schemas affected
  - X fields added, Y fields removed, Z types changed
TypeScript errors: N new errors
Action required:
  - [file:line] description
Suggestions (no breakage):
  - [file] description
```

Do not auto-apply any code changes. Present findings and wait for user to confirm which suggestions to act on.
