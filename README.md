# OpenWallet Vietnam - Web

Open-source digital wallet card database for Vietnam.

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   pnpm dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Project Structure

```
/app
  /(marketing)
    /page.tsx           → Landing page
    /layout.tsx         → Marketing layout
  /app
    /page.tsx           → "Coming Soon" page
  /docs
    /route.ts           → Scalar API docs renderer
  /layout.tsx           → Root layout
  /globals.css          → Global styles with brand colors
/components
  /ui                   → UI components (Shadcn/ui - future)
/lib
  /utils.ts             → Utility functions
/public
  /logo.png             → OpenWallet logo
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

For production, use:
```env
NEXT_PUBLIC_API_URL=https://api.openwallet.vn
```

## Routes

- `/` - Landing page
- `/app` - Coming soon page for the card manager app
- `/docs` - API documentation powered by Scalar

## Brand Colors

- **Blue**: `#2563EB` (Primary)
- **Red**: `#DC2626` (Accent)
- **Dark**: `#0F172A` (Backgrounds)

## Tech Stack

- Next.js 16.1.6
- React 19.2.4
- TypeScript
- Tailwind CSS v4
- Scalar API Reference (CDN)
- pnpm (package manager)

## License

MIT
