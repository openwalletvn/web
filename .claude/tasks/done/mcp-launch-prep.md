# MCP Launch Prep - Auth, Tracking, Marketing Pages

## Task

Prepare OpenWallet MCP for public launch this week. Three parts: (1) add multi-key auth with expiration to the MCP CF Worker, (2) add per-key usage tracking via CF Analytics Engine, (3) create marketing landing pages for MCP and Wallet Chat on openwallet.vn.

Auth deferred to full system later - keys are hardcoded in CF secrets for now, rotated manually.

## Acceptance Criteria

### MCP Auth (repo: `/Users/bmp/PHUC-LOCAL/openwalletvn/mcp`)
- [ ] `src/auth.ts` created - `validateKey(key, keysJson)` returns false if key missing, not found, or expired
- [ ] `X-MCP-Key` header checked on every request before any tool runs
- [ ] 401 returned with `{ error: "Invalid or missing API key" }` on fail
- [ ] `MCP_KEYS` CF secret format: `[{"key":"owmcp_xxx","expires":"2026-12-31","label":"public-beta"}]`
- [ ] Multiple keys supported - revoke one without breaking others
- [ ] Expired key → 401 (date check at request time)
- [ ] `.dev.vars` example updated with `MCP_KEYS` entry
- [ ] `wrangler.toml` documents secret (comment, not value)

### Per-Key Tracking (repo: `/Users/bmp/PHUC-LOCAL/openwalletvn/mcp`)
- [ ] CF Analytics Engine binding `ANALYTICS` added to `wrangler.toml`
- [ ] On every valid request: write data point `{ blobs: [label, tool_name], indexes: [label] }`
- [ ] Usage visible per key label in CF dashboard

### Marketing Page: `/mcp` (repo: web)
- [ ] `app/(marketing)/mcp/page.tsx` created with full SEO metadata
- [ ] JSON-LD: `SoftwareApplication` schema
- [ ] Sections: hero (what is MCP), tools list (8 tools), how to get key (email form placeholder or link), code example (Claude Desktop config snippet)
- [ ] CTA button linking to key request (placeholder URL for now)
- [ ] `ow-mcp-page` wrapper class
- [ ] Added to sitemap

### Marketing Page: `/wallet-chat` (repo: web)
- [ ] `app/(marketing)/wallet-chat/page.tsx` created with full SEO metadata
- [ ] JSON-LD: `SoftwareApplication` schema
- [ ] Sections: hero, feature highlights (local-first, no account, AI-powered), CTA to open `/chat`
- [ ] `ow-wallet-chat-page` wrapper class
- [ ] Added to sitemap

## Files Affected

| File | Repo | Change |
|------|------|--------|
| `src/auth.ts` | mcp | CREATE - key validation |
| `src/index.ts` | mcp | EDIT - add auth + analytics middleware |
| `wrangler.toml` | mcp | EDIT - add `ANALYTICS` binding, document `MCP_KEYS` secret |
| `.dev.vars` (or example) | mcp | EDIT - add `MCP_KEYS` example |
| `app/(marketing)/mcp/page.tsx` | web | CREATE |
| `app/(marketing)/wallet-chat/page.tsx` | web | CREATE |
| `app/sitemap.ts` (or equivalent) | web | EDIT - add `/mcp`, `/wallet-chat` |

## Notes

- MCP repo path: `/Users/bmp/PHUC-LOCAL/openwalletvn/mcp`
- Web repo path: `/Users/bmp/PHUC-LOCAL/openwalletvn/web`
- CF secret set via: `wrangler secret put MCP_KEYS` (paste JSON array)
- Full auth system (per-user keys, credits, accounts) deferred - see `.claude/plans/we-will-soon-to-snug-seal.md`
- Marketing pages: Vietnamese content, follow existing `(marketing)` layout patterns
- Do MCP repo changes first, web marketing pages are independent
