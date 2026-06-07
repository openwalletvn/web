# OpenWallet Brain

SSOT for business context, mental model, and product knowledge. Pages and docs are consumers — update here first, then regenerate content.

---

## What is OpenWallet

Vietnamese bank card comparison and advisory tool. Independent editorial principle: ranking algorithm is not influenced by commercial relationships with any bank.

**URL:** https://openwallet.vn
**GitHub:** https://github.com/openwalletvn

---

## Origin story

Started as a personal need: own multiple credit cards, want to use them smarter. Each purchase raised the question: which card gives the best cashback here? Could ask Facebook groups, but a software engineer's answer is to build a system.

First version launched **16/8/2025** under a different name. OpenWallet is the 2026 rebuild: mature database schema capable of handling each card's individual cashback rules. That schema took months of trial and error. The result is Card Match and Card Battle.

---

## Core values

- **Editorial independence:** rankings not influenced by bank commercial relationships
- **Data-first:** no guessing, no web search — tool calls only against real database
- **Free and open:** no accounts required for Owie, website is open source
- **Vietnamese-first:** product targets Vietnamese users; technical terms stay English
- **Honest:** if data is missing, say so — do not fabricate numbers

---

## Products (live)

### Card Battle (`/card-battle`)
Compare any two cards side by side. Data-driven: fees, cashback, perks.
- Static pages generated for known pairs via `getComparePairs()`
- Unknown pairs: 404 → redirect to `/card-battle?compare=A,B`

### Card Match (`/card-match`)
Enter spending habits → system ranks best cards for specific needs.
- Uses intent system (macro → micro → atomic)
- `POST /api/ranking` proxy to API ranking engine

### Owie Chat (`/owie-chat` landing, `/chat` full app)
AI assistant for card advice. Built by OpenWallet team.
- Queries OpenWallet database via MCP (13 tools) — no web search
- Does not fabricate data; says so when data is missing
- Free, no account required
- Model: free tier (env `CHAT_MODEL`), rate limit 20 req/min per IP
- Messages stored in localStorage only — no server history
- Logs via Langfuse for quality monitoring (disclosed to users)

### OpenWallet MCP (`/mcp`)
MCP server exposing card database to any AI tool (Claude, ChatGPT, Cursor).
Not limited to OpenWallet — any MCP-compatible assistant can connect.

---

## Products (frozen / not public)

### Wallet App (`/app/*`)
Local-first wallet tracker (IndexedDB, Dexie.js). Returns 404 unless `WALLET_ENABLED=true`.
Code preserved. ROI too low vs competitors currently. May revive.

---

## Personas (target users)

Organized under `/linh-vuc/`:
- `an-uong` — food & drink
- `di-chuyen` — transport
- `dich-vu-so` — digital services (Shopee, TikTok Shop, Grab)
- `doanh-nghiep` — business
- `du-lich` — travel
- `gia-dinh` — family
- `shopee` — Shopee-specific
- `sieu-thi` — supermarket

---

## Tone and voice

- **chúng tôi** (not "chúng ta", not "team OpenWallet" in body copy)
- Professional and honest — not corporate, not casual
- No em dashes (—): replace with comma, colon, or restructure
- No AI writing signals: no "hành trình", no "không chỉ là X mà còn là Y" constructions
- Transparency: disclose Langfuse logging, free model limits, localStorage-only history

---

## Community and contact

- **Discord:** https://discord.gg/bsnHax5BYZ
- **Contact form:** `/lien-he`
- **GitHub:** https://github.com/openwalletvn (issues, feature requests)
- Card database: not open for direct edits — internal review process for data accuracy

---

## Key dates

| Date | Event |
|------|-------|
| 16/8/2025 | First version launched (different name, card + MCC database) |
| 2026 | OpenWallet rebrand, new schema, Card Match + Card Battle + Owie |
