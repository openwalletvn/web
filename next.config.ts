import type { NextConfig } from "next";
import { getTool } from './lib/tools';

const cardBattleHref = getTool('Card Battle').href;
const cardMatchHref = getTool('Card Match').href;

const nextConfig: NextConfig = {
  turbopack: {},

  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:pair([^/]*-vs-[^/]*)',
        destination: `${cardBattleHref}/:pair`,
        permanent: true,
      },
      {
        source: '/so-sanh',
        destination: cardBattleHref,
        permanent: true,
      },
      {
        source: '/so-sanh/:path*',
        destination: `${cardBattleHref}/:path*`,
        permanent: true,
      },
      {
        source: '/goi-y-the',
        destination: cardMatchHref,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
