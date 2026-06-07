# OpenWallet MCP

**Status: LIVE.** Landing page at `/mcp`.

MCP server exposing the OpenWallet card database to any AI tool: Claude, ChatGPT, Cursor, or any MCP-compatible assistant.

Not limited to OpenWallet — any MCP client can connect.

---

## What it is

A stateless HTTP MCP server running as a Cloudflare Worker. Provides 13 tools over the OpenWallet card database. Owie Chat uses it as its only data source.

Repo: `../mcp` (sibling to this web repo)

---

## Connecting

**Remote URL:** `https://mcp.openwallet.vn` (or `OPENWALLET_MCP_URL` env var)

For local dev: `http://localhost:8001` (fallback in `/api/chat/route.ts`)

**Auth:** `OPENWALLET_MCP_KEY` header — same key as `OPENWALLET_API_KEY`.

---

## 13 tools

| Tool | Purpose |
|---|---|
| `rank-cards-for-spend` | Rank cards by spend profile + intent |
| `find-card` | Lookup card by name or ID |
| `find-bank` | Lookup bank by name or ID |
| `get-card-detail` | Full card details: fees, cashback rules, perks |
| `compare-cards` | Side-by-side structured comparison |
| `related-cards` | Similar card suggestions |
| `cashback-card` | Calculate cashback for a specific card + spend profile |
| `list-merchants` | All merchants with MCC codes |
| `list-personas` | All spend personas (travel, food, etc.) |
| `search-cards` | Search cards by bank, type, network, intent |
| `list-intents` | Flat intent list for LLM routing/grounding |
| `list-intent-groups` | Nested intent tree (macro→micro→atomic) |
| `list-banks` | All banks for disambiguation |

---

## Stateless vs stateful

MCP server is stateless — no session, no memory. Every tool call is independent.

See `../web/.claude/docs/learnings/mcp-stateless-vs-stateful.md` for design decision.

---

## Key env vars

```
OPENWALLET_MCP_URL=https://mcp.openwallet.vn   # in web repo
OPENWALLET_MCP_KEY=...                          # in web repo + mcp repo
```

---

## Local dev

```bash
cd ../mcp
pnpm dev   # starts on :8001
```

Web repo `/api/chat/route.ts` falls back to `http://localhost:8001` when `OPENWALLET_MCP_URL` is not set.

---

## Landing page (`/mcp`)

Marketing page explaining what MCP is, how to connect, use cases.
Static export, no API calls, no revalidate needed.
