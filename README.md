# OpenWallet Vietnam

[![Vercel Deployment](https://img.shields.io/github/deployments/openwalletvn/web/Production?logo=vercel&label=vercel&color=black)](https://openwallet.vn)
[![MCP v0.1.0](https://img.shields.io/endpoint?url=https%3A%2F%2Fmcp.openwallet.vn%2Fbadge&cacheSeconds=60)](https://mcp.openwallet.vn/health)
[![API v1.0.0](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.openwallet.vn%2Fbadge&cacheSeconds=60)](https://api.openwallet.vn/health)

Open-source digital wallet card database for Vietnam. Public card comparison site + local-first wallet manager (IndexedDB, no accounts).

**Site:** https://openwallet.vn

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Environment Variables

Create `.env.local`:

```env
OPENWALLET_API_KEY=your_api_key_here
```

`OPENWALLET_API_KEY` is a server-only build secret — never use `NEXT_PUBLIC_` prefix.

## Deploy

Vercel. SSR/SSG with dynamic routes. Data fetched at build time where possible.

## Tech Stack

- Next.js + React
- TypeScript
- Tailwind CSS v4
- Dexie.js (IndexedDB)
- PostHog
- pnpm

## License

PolyForm Noncommercial 1.0.0 — study and personal use only, no commercial forks.
