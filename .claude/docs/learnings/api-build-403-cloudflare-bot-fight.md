# Build 403 from Cloudflare Bot Fight Mode

## What happened

Vercel preview builds failed with:
```
Error: API key missing or forbidden (403): /api/v1/banks - key set (81a0...), target=https://api.openwallet.vn
```

Key was correct, URL was correct. `OPENWALLET_API_KEY` was set in Vercel for all environments.

## Root cause

`api.openwallet.vn` runs on Cloudflare Workers with **Bot Fight Mode** enabled. Vercel build machines run on AWS/GCP datacenter IPs - Cloudflare classifies these as bots and returns 403 **before the request reaches the Worker**. The API application code never sees the request.

The 403 was always happening but was previously hidden by `SyntaxError: Unexpected token '<'` - the API returned an HTML error page with 200 status (CDN layer), and `res.json()` failed before the status check.

## Why ALLOWED_ORIGINS was not the cause

`ALLOWED_ORIGINS` in the API only sets CORS response headers. It never blocks requests. Not a security gate - purely for browser CORS compliance.

## Fix applied

Disabled Bot Fight Mode on the `api.openwallet.vn` Cloudflare zone.

## Better long-term fix

Keep Bot Fight Mode on, add a WAF Custom Rule to bypass it for authenticated API requests:
- Expression: `(len(http.request.headers["x-openwallet-key"]) > 0)`
- Action: Skip → Bot Fight Mode

This way scrapers/bots are still blocked, but requests with a valid API key header pass through.

## Code improvements made alongside this

- `apiFetch` now warns on missing `OPENWALLET_API_KEY`, shows specific 401/403 messages, and detects 200+HTML responses (CDN maintenance pages) with actionable error text
- `generateStaticParams` in `the/[slug]` and `ngan-hang/[slug]` wrapped in try/catch - returns `[]` on failure so build continues (pages still work at runtime via ISR)
- `sitemap.ts` bank/card fetches wrapped in try/catch - partial sitemap on API failure
- Category pages (`the/`, `the-shopee/`, etc.) intentionally hard-fail so build stops with clear error when API is unreachable
