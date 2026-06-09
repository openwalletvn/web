<img width="1280" height="660" alt="og" src="https://github.com/user-attachments/assets/94b28f05-29be-42cf-92bd-1c5dcf92d610" />

# OpenWallet

[![MCP v0.1.0](https://img.shields.io/endpoint?url=https%3A%2F%2Fmcp.openwallet.vn%2Fbadge&cacheSeconds=60)](https://mcp.openwallet.vn/health)
[![API v1.0.0](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.openwallet.vn%2Fbadge&cacheSeconds=60)](https://api.openwallet.vn/health)
[![Storybook](https://img.shields.io/badge/storybook-FF4785?logo=storybook&logoColor=white)](https://storybook.openwallet.vn)

**OpenWallet** là công cụ so sánh và tư vấn thẻ ngân hàng Việt Nam, xây dựng trên nguyên tắc độc lập về biên tập: thuật toán xếp hạng và gợi ý thẻ không bị chi phối bởi quan hệ thương mại với bất kỳ ngân hàng nào.

Không cần lướt hàng chục trang web. Gợi ý khách quan theo nhu cầu của bạn.

## Tính năng

- **[Card Match](https://openwallet.vn/card-match)** — Nhập thói quen chi tiêu, hệ thống xếp hạng và gợi ý thẻ phù hợp nhất theo nhu cầu cụ thể của bạn.
- **[Card Battle](https://openwallet.vn/card-battle)** — So sánh hai thẻ bất kỳ cạnh nhau, dựa trên dữ liệu thực về phí, hoàn tiền và ưu đãi.
- **[Owie Chat](https://openwallet.vn/owie-chat)** — Trợ lý AI tư vấn thẻ, trả lời dựa trên dữ liệu thực từ OpenWallet. Miễn phí, không cần đăng ký.
- **[OpenWallet MCP](https://openwallet.vn/mcp)** — Tích hợp dữ liệu thẻ OpenWallet vào AI assistant của bạn như Claude hay ChatGPT qua giao thức MCP.
- **Cơ sở dữ liệu thẻ** — Tra cứu thông tin chi tiết về 300+ thẻ từ 20+ ngân hàng tại Việt Nam.

**Site:** https://openwallet.vn

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Component Browser (Storybook)

```bash
pnpm storybook
```

Open http://localhost:4000. Stories live alongside components as `*.stories.tsx`. Use `/create-story` in Claude Code to generate a story for any component.

Published: https://storybook.openwallet.vn

## Environment Variables

Create `.env.local`:

```env
OPENWALLET_API_KEY=your_api_key_here
```

`OPENWALLET_API_KEY` is a server-only build secret - never use `NEXT_PUBLIC_` prefix.

## Deploy

Vercel. SSR/SSG with dynamic routes. Data fetched at build time where possible.

## Tech Stack

- Next.js + React
- TypeScript
- Tailwind CSS v4
- Dexie.js (IndexedDB)
- PostHog
- Storybook 10
- pnpm

## License

PolyForm Noncommercial 1.0.0 - study and personal use only, no commercial forks.
