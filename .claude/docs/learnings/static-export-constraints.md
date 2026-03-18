# Next.js Static Export Constraints

## What It Means

This project uses `output: 'export'` in `next.config.ts`. This means `pnpm build` produces a plain `out/` folder of HTML/CSS/JS files — no Node.js server runs at all. The site is hosted as static files (e.g. Cloudflare Pages, S3, etc).

## What You CAN'T Do

- **No server-side rendering at request time** — `headers()`, `cookies()`, `redirect()` from `next/headers` are unavailable
- **No API routes** — `app/api/` route handlers don't work in static export
- **No dynamic routes without `generateStaticParams`** — if a page has `[slug]`, you must export all possible slugs at build time
- **No middleware** — `middleware.ts` doesn't work with static export

## What You CAN Do

- **`generateStaticParams`** — tells Next.js which paths to pre-render for dynamic routes
- **`fetch` at build time** — data fetching in `async` Server Components runs at build time and bakes data into the HTML
- **Client-side data fetching** — `useEffect` + `fetch` works fine at runtime in the browser

## Build-Time Data Fetching Pattern

```tsx
// This runs at BUILD TIME — result is baked into static HTML
export default async function CardPage({ params }) {
  const card = await apiFetch(`/api/v1/cards/${params.id}`); // called once at build
  return <CardDetail card={card} />;
}

export async function generateStaticParams() {
  const cards = await apiFetch('/api/v1/cards');
  return cards.map(c => ({ id: c.id }));
}
```

## API Key at Build Time

`apiFetch()` in `lib/api.ts` injects `OPENWALLET_API_KEY` — a server-only env var available only during `pnpm build`. Never use `NEXT_PUBLIC_` for this key (would expose it in client JS).

## Implication: No Real-Time Data

Public pages (cards, banks, blog) show data as of the last deploy. To update card info, you must rebuild and redeploy the site. This is intentional — it keeps hosting free and simple.
