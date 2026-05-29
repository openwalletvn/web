# OpenWallet MCP Server

## Task

Build a public MCP server at `mcp.openwallet.vn` on Cloudflare Workers so all AI tools (card search, ranking, bank resolution) are defined once and consumed by web chat, future mobile app, and third-party devs. Requires 3 coordinated changes: (1) migrate ranking logic and add new endpoints to API repo, (2) build MCP CF Worker as thin consumer of API, (3) clean up web repo to remove duplicated ranking logic. API remains private; MCP is public with key auth.

## Acceptance Criteria

- [ ] `POST /api/v1/cards/rank` endpoint added to API repo with `card-ranker.ts` + `cashback-calc.ts` migrated from web
- [ ] `GET /api/v1/banks?q=` fuzzy search added (alias support: vcb, tcb, acb, etc.)
- [ ] `GET /api/v1/cards?q=` text search added (matches name, id, bank_id)
- [ ] API OpenAPI spec + `.claude/docs/` updated to reflect new endpoints
- [ ] MCP CF Worker created at `/Users/bmp/PHUC-LOCAL/openwalletvn/mcp` with all 8 tools
- [ ] MCP auth: `X-MCP-Key` header required, 401 on missing/invalid
- [ ] MCP works locally via `wrangler dev` (port 8001) connecting to `localhost:3002`
- [ ] MCP deployed to `mcp.openwallet.vn`
- [ ] Web `app/api/chat/route.ts` removes local `rankCards()` — calls `POST /api/v1/cards/rank` instead
- [ ] Web `components/marketing/card-ranking-table.tsx` updated to call API rank endpoint
- [ ] `web/lib/card-ranker.ts` + `web/lib/cashback-calc.ts` deleted after web cleanup
- [ ] MCP `README.md` documents all 8 tools with auth instructions and usage examples

## Files Affected

| File | Change |
|------|--------|
| `api/app/api/v1/cards/rank/route.ts` | New — POST ranking endpoint |
| `api/app/api/v1/banks/route.ts` | Extend — add `?q=` fuzzy search |
| `api/app/api/v1/cards/route.ts` | Extend — add `?q=` text search |
| `api/lib/data-loader.ts` | Extend `filterCards()` with `q` param |
| `api/lib/card-ranker.ts` | New — migrated from web |
| `api/lib/cashback-calc.ts` | New — migrated from web |
| `api/lib/schemas.ts` | Add rank request Zod schema |
| `api/app/api/v1/openapi.json/route.ts` | Add new endpoints to spec |
| `api/.claude/docs/api-architecture.md` | Document new endpoints |
| `api/.claude/docs/card-recommendation-architecture.md` | Note ranking moved here |
| `mcp/` | New repo — all files |
| `web/app/api/chat/route.ts` | Remove rankCards import; call API rank endpoint |
| `web/components/marketing/card-ranking-table.tsx` | Call API rank endpoint |
| `web/lib/card-ranker.ts` | Delete after web cleanup |
| `web/lib/cashback-calc.ts` | Delete after web cleanup |

## Notes

- API dev port: 3002 (from web `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3002`)
- MCP dev port: 8001 (wrangler default)
- Do Phase 1 (API) before Phase 2 (MCP) before Phase 3 (web cleanup) — dependencies in that order
- `card-ranking-table.tsx` imports `rankCards` client-side — switch to API call (server action or fetch) before deleting web ranker files
- MCP secrets: `MCP_API_KEY` + `OPENWALLET_API_KEY` via `wrangler secret put`
- CF Worker 3MB limit: MCP deps are light (`@modelcontextprotocol/sdk` + `zod`) — should fit
