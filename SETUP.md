# OpenWallet Vietnam - Setup Complete ✅

## Project Overview
Next.js 16 web application for OpenWallet Vietnam - an open-source digital wallet card database.

## What's Been Set Up

### 1. **Core Framework**
- ✅ Next.js 16.1.6 with App Router
- ✅ React 19.2.4
- ✅ TypeScript (strict mode)
- ✅ Tailwind CSS v4 (latest)
- ✅ pnpm as package manager

### 2. **Routes Created**

#### Landing Page (`/`)
- Minimal hero section with OpenWallet branding
- "View API Documentation" CTA button
- Links to GitHub and app page
- Dark gradient background with brand colors

#### Coming Soon Page (`/app`)
- Large "Coming Soon" message
- Placeholder for future card manager app
- Back to home link

#### API Documentation (`/docs`)
- **Route Handler** (not a page component)
- Renders Scalar API Reference via CDN
- Points to: `${NEXT_PUBLIC_API_URL}/api/v1/openapi.json`
- Themed with brand colors
- No npm package required (uses CDN)

### 3. **Brand Colors**
Defined in `app/globals.css` using Tailwind v4 theme system:
- **Blue** (`--color-brand-blue`): `#2563eb` - Primary
- **Red** (`--color-brand-red`): `#dc2626` - Accent
- **Dark** (`--color-brand-dark`): `#0f172a` - Backgrounds

### 4. **Configuration Files**
- ✅ `package.json` - Dependencies and scripts
- ✅ `tsconfig.json` - TypeScript strict mode
- ✅ `postcss.config.mjs` - Tailwind v4 PostCSS plugin
- ✅ `next.config.ts` - Next.js configuration
- ✅ `.env.local` - Local API URL (localhost:3002)
- ✅ `.env.example` - Production API URL template
- ✅ `.gitignore` - Excludes node_modules, .next, .env.local, pnpm-lock.yaml

### 5. **Project Structure**
```
/app
  /(marketing)
    /page.tsx           → Landing page
    /layout.tsx         → Marketing layout
  /app
    /page.tsx           → Coming soon page
  /docs
    /route.ts           → Scalar API docs (Route Handler)
  /layout.tsx           → Root layout with metadata
  /globals.css          → Tailwind v4 + brand colors
/lib
  /utils.ts             → cn() utility function
/public
  /logo.svg             → Placeholder OpenWallet logo
```

## Environment Variables

### Local Development (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Production (`.env.example`)
```env
NEXT_PUBLIC_API_URL=https://api.openwallet.vn
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Dev Server
- **Local**: http://localhost:3000
- **Network**: http://192.168.1.68:3000

## What's NOT Included Yet
(Following the prompt's instructions)
- ❌ Shadcn/ui components (future phase)
- ❌ Dexie.js for offline storage (future phase)
- ❌ Scalar npm package (using CDN instead)

## Key Technical Decisions

1. **Tailwind v4** - Using new CSS-based configuration with `@theme`
2. **pnpm** - Fast, disk-efficient package manager
3. **Route Handler for /docs** - Proper Next.js pattern for custom HTML responses
4. **Minimal design** - Clean, focused landing page as requested
5. **Brand colors** - Integrated throughout via Tailwind theme

## Next Steps

1. Ensure backend API is running on `localhost:3002`
2. Visit http://localhost:3000 to see landing page
3. Visit http://localhost:3000/docs to see API documentation
4. Visit http://localhost:3000/app to see coming soon page

## Notes

- The `/docs` route will fail until the backend API is running and serving OpenAPI spec at `/api/v1/openapi.json`
- Mobile responsive design included
- SEO meta tags configured in root layout
- TypeScript strict mode enabled for type safety

---

**Status**: ✅ Ready for development
**Next Phase**: Card manager app with Dexie.js
