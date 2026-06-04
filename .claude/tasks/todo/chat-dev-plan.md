# Chat Dev Plan

Status: In progress | Updated: 2026-06-04 | Branch: preview

---

## Goal

Make chat answer these questions well. Evals are the quality gate.

---

## Core questions (product scope)

### Cat A: Card discovery (user has no cards)
| # | User question | MCP tools |
|---|---|---|
| A1 | "Thẻ nào phù hợp chi tiêu của tôi?" (describe spend amounts) | `rank-cards-for-spend` |
| A2 | "Thẻ nào tốt cho Shopee / Grab / TikTok Shop?" | `list-merchants` → `rank-cards-for-spend` |
| A3 | "Thẻ không phí thường niên tốt nhất?" | `rank-cards-for-spend` (constraint) |
| A4 | "Tôi hay đi du lịch, thẻ nào?" | `list-personas` → `rank-cards-for-spend` |
| A5 | "VCB có những thẻ gì?" | `find-bank` → `search-cards` |

### Cat B: Spend optimization (user has cards, asks how to use)
| # | User question | MCP tools |
|---|---|---|
| B1 | "Tôi có thẻ A và B, nên dùng thẻ nào mua xăng?" | `find-card` × N → `cashback-card` × N |
| B2 | "Thẻ X hoàn tiền bao nhiêu cho Shopee?" | `find-card` → `cashback-card` |

Cat B: no wallet integration. User types card name(s) → LLM resolves via `find-card`.

### Cat C: Card research
| # | User question | MCP tools |
|---|---|---|
| C1 | "Phí thường niên thẻ X?" | `find-card` → `get-card-detail` |
| C2 | "So sánh thẻ A vs B" | `find-card` × 2 → `compare-cards` |
| C3 | "Thẻ nào tương tự thẻ X?" | `find-card` → `related-cards` |
| C4 | "Techcom có thẻ gì?" | `find-bank` → `search-cards` |

---

## MCP tools (13 registered, all justified)

Local dev: falls back to `http://localhost:8001` (no env var needed locally).
Prod: `OPENWALLET_MCP_URL` env var.

| Tool | Used by |
|---|---|
| `rank-cards-for-spend` | A1 A2 A3 A4 |
| `find-card` | B1 B2 C1 C2 C3 |
| `find-bank` | A5 C4 |
| `get-card-detail` | C1 |
| `compare-cards` | C2 |
| `related-cards` | C3 |
| `cashback-card` | B1 B2 |
| `list-merchants` | A2 |
| `list-personas` | A4 |
| `search-cards` | A5 C4 |
| `list-intents` | LLM routing / grounding |
| `list-intent-groups` | LLM routing / grounding |
| `list-banks` | disambiguation |

---

## Phase 1: Eval coverage

Write eval cases for all 10 core questions. Pass ≥ 85% before moving on.

### Cat A evals
- [ ] `A1-spend-basic` — "Chi 5M/tháng, thẻ nào?"
- [ ] `A1-spend-multi` — "Chi 3M Shopee + 1M ăn uống + 2M xăng, thẻ nào?"
- [ ] `A2-merchant-shopee` — "Thẻ nào hoàn tiền Shopee tốt nhất?"
- [ ] `A2-merchant-tiktok` — "Tôi hay mua TikTok Shop, thẻ nào?"
- [ ] `A3-no-fee` — "Thẻ hoàn tiền cao nhưng phí năm dưới 500k"
- [ ] `A4-persona-traveler` — "Tôi hay đi du lịch nước ngoài, thẻ nào?"
- [ ] `A4-persona-commuter` — "Thẻ nào tốt cho người đi xăng hàng ngày?"
- [ ] `A5-bank-browse` — "VCB có những thẻ tín dụng gì?"

### Cat B evals
- [ ] `B1-multi-card-optimize` — "Tôi có thẻ Techcombank Visa và VCB Mastercard, dùng thẻ nào mua xăng?"
- [ ] `B2-cashback-query` — "Thẻ Sacombank Cashback hoàn bao nhiêu % cho Shopee?"

### Cat C evals
- [ ] `C1-card-fees` — "Phí thường niên thẻ Sacombank UnionPay Platinum?"
- [ ] `C2-compare` — "So sánh thẻ Techcombank và VPBank"
- [ ] `C3-related` — "Có thẻ nào tương tự không?" (with pageContext card)
- [ ] `C4-bank-cards` — "Techcom có thẻ gì?"

### Hallucination guard evals
- [ ] `guard-invented-rate` — ask specific % → must call tool, not invent
- [ ] `guard-nonexistent-bank` — "Thẻ ABCBank" → must say not found
- [ ] `guard-ambiguous` — "Thẻ techcom" → must disambiguate via `find-bank`

### Harness improvements needed
- [ ] Add `pageContext` field to eval case schema
- [ ] Add `expectToolCalls` field — assert which tools were called
- [ ] Wire to CI (GitHub Actions) on push to preview/main

---

## Phase 2: System prompt iteration

Prompt lives in Langfuse UI (cloud.langfuse.com → Prompts → `chat-system-prompt` label=production).
Edit in UI → new version tagged `production` → live within 60s (cache TTL).

**Known gaps (drive from eval failures):**
- No instruction: use `list-merchants` when user mentions brand name
- No instruction: spend-profile flow → ask amounts → call `rank-cards-for-spend`
- No instruction: persona shortcut → "hay đi du lịch" → `list-personas`
- No instruction: Cat B flow → "tôi có thẻ X" → `find-card` → `cashback-card`

**Additions needed:**
```
## Công cụ và khi nào dùng
- Merchant mention (Shopee, Grab, TikTok Shop...): gọi list-merchants → map sang intent → rank
- Mô tả chi tiêu: hỏi số tiền → gọi rank-cards-for-spend với spend breakdown
- "Dân du lịch / đi công tác": gọi list-personas → dùng persona phù hợp trong rank
- "Tôi có thẻ X": gọi find-card → cashback-card hoặc compare-cards
- Hỏi thẻ tương tự: gọi related-cards với card_id hiện tại
```

---

## Phase 3: UI polish

- [ ] Remove debug "Copy messages" button (`ClipboardCopyIcon`) from `chat-panel.tsx:154`
- [ ] Verify page context badge only renders when `pageContext` non-null (`chat-panel.tsx:186-195`)
- [ ] Add suggested starter prompts when thread empty:
  - "Thẻ nào hoàn tiền Shopee tốt nhất?"
  - "So sánh thẻ Techcombank và VPBank"
  - "Tôi chi 5 triệu/tháng, thẻ nào phù hợp?"
  - "Tôi có thẻ VCB, nên dùng thẻ đó cho gì?"
- [ ] Verify `/chat?id=` param restores conversation correctly

---

## Phase 4: PageContext expansion

Currently only `card` and `bank` pages send context.

| Page | Context type | File |
|---|---|---|
| `/card-battle?compare=X,Y` | `type: 'compare', cardIds: [X,Y]` | `app/(marketing)/card-battle/page.tsx` |
| `/the/[persona]` | `type: 'persona', personaSlug, personaName` | persona page component |

Add to `lib/chat/page-context.ts`:
```ts
| { type: 'compare'; cardIds: string[]; cardNames: string[] }
| { type: 'persona'; personaSlug: string; personaName: string }
```

---

## What NOT to do

- No wallet integration with chat
- No persistent server-side chat history — IndexedDB only
- No user auth — anonymous only
- No new MCP tools — all 13 justified
- Chat button stays hidden in header until explicitly requested
