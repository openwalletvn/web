import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages (CF_PAGES=1 is set automatically by Cloudflare).
  // Local dev uses normal Next.js mode so API routes work.
  output: process.env.CF_PAGES === '1' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
