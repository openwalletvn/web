# OpenWallet Vietnam

Open-source digital wallet card database for Vietnam. Public card comparison site + local-first wallet manager (IndexedDB, no accounts).

**Site:** https://openwallet.vn | **API:** https://api.openwallet.vn

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
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

`OPENWALLET_API_KEY` is a server-only build secret — never use `NEXT_PUBLIC_` prefix.

## Deploy

Vercel. Static export (`output: 'export'`). All data fetched at build time.

## Tech Stack

- Next.js + React
- TypeScript
- Tailwind CSS v4
- Dexie.js (IndexedDB)
- PostHog
- pnpm

## License

MIT
