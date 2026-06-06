# Cloudflare _redirects catches static assets too

`public/_redirects` rules apply to ALL requests - HTML pages AND static files.

Current rules:
```
/cards/*  /the/:splat  301
/banks/*  /ngan-hang/:splat  301
/blog/*   /tin-tuc/:splat    301
```

## Gotcha

Card images in `/public/cards/` → served at `/cards/image.avif` → Cloudflare 301 → `/the/image.avif` → 404.

**Rule:** static asset folders must NOT share a prefix with redirect source paths.

## Convention

Card images live in `/public/the/` (not `/public/cards/`) to match where `/cards/*` redirects land.
Bank images live in `/public/ngan-hang/` (not `/public/banks/`).

## Debugging shortcut

If deployed image 404s with unexpected path prefix, check `public/_redirects` first.
