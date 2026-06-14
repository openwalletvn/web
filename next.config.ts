import type { NextConfig } from "next";
import { getTool } from './lib/tools';

const cardBattleHref = getTool('Card Battle').href;
const cardMatchHref = getTool('Card Match').href;

const nextConfig: NextConfig = {
  turbopack: {},
  reactStrictMode: false,

  experimental: {
    preloadEntriesOnStart: false,
  },

  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/tin-tuc/tag/:tag',
        destination: '/tin-tuc',
        permanent: true,
      },
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
      // category paths - must be before generic /cards/:slug* rule
      { source: '/cards', destination: '/the', permanent: true },
      { source: '/cards/credit', destination: '/loai-the/the-tin-dung', permanent: true },
      { source: '/cards/debit', destination: '/loai-the/the-ghi-no', permanent: true },
      { source: '/cards/2in1', destination: '/loai-the/the-hybrid', permanent: true },
      { source: '/cards/visa', destination: '/the', permanent: true },
      { source: '/cards/mastercard', destination: '/the', permanent: true },
      { source: '/cards/amex', destination: '/the', permanent: true },
      { source: '/cards/jcb', destination: '/the', permanent: true },
      { source: '/cards/napas', destination: '/the', permanent: true },
      { source: '/cards/unionpay', destination: '/the', permanent: true },
      { source: '/cards/networks/:path*', destination: '/the', permanent: true },
      { source: '/cards/co-branded/:path*', destination: '/the', permanent: true },
      // generic card slug - after category rules
      {
        source: '/cards/:slug*',
        destination: '/the/:slug*',
        permanent: true,
      },
      // card type pages - old flat URLs redirect to new /loai-the/* structure
      { source: '/the-tin-dung', destination: '/loai-the/the-tin-dung', permanent: true },
      { source: '/the-ghi-no', destination: '/loai-the/the-ghi-no', permanent: true },
      { source: '/the-hybrid', destination: '/loai-the/the-hybrid', permanent: true },
      { source: '/cards/hybrid', destination: '/loai-the/the-hybrid', permanent: true },
      { source: '/the-2-trong-1', destination: '/loai-the/the-hybrid', permanent: true },
      { source: '/the-kim-loai', destination: '/loai-the/the-hybrid', permanent: true },
      { source: '/the-tin-dung-amex', destination: '/the', permanent: true },
      { source: '/the-tin-dung-phi-thuong-nien-thap', destination: '/loai-the/the-tin-dung-mien-phi-thuong-nien', permanent: true },
      { source: '/openwallet-app', destination: '/', permanent: true },
      { source: '/llms/:path*', destination: '/', permanent: true },
      { source: '/api/patches/:path*', destination: '/', permanent: true },
      // persona pages - old flat URLs redirect to nested structure
      { source: '/the-shopee', destination: '/linh-vuc/shopee', permanent: true },
      { source: '/the-sieu-thi', destination: '/linh-vuc/sieu-thi', permanent: true },
      { source: '/the-chi-tieu-dich-vu-so', destination: '/linh-vuc/dich-vu-so', permanent: true },
      { source: '/the-danh-cho-giao-duc', destination: '/linh-vuc/gia-dinh', permanent: true },
      { source: '/the-danh-cho-y-te', destination: '/linh-vuc/gia-dinh', permanent: true },
      { source: '/the-danh-cho-bao-hiem', destination: '/linh-vuc/gia-dinh', permanent: true },
      { source: '/the-doanh-nghiep', destination: '/linh-vuc/doanh-nghiep', permanent: true },
      // route rename redirect
      { source: '/the-theo-nhu-cau', destination: '/linh-vuc', permanent: true },
      { source: '/the-theo-nhu-cau/:path*', destination: '/linh-vuc/:path*', permanent: true },
      { source: '/banks', destination: '/ngan-hang', permanent: true },
      {
        source: '/banks/:slug*',
        destination: '/ngan-hang/:slug*',
        permanent: true,
      },
      { source: '/changelog', destination: '/roadmap', permanent: true },
      { source: '/openwallet-chat', destination: '/owie-chat', permanent: true },
      { source: '/openwallet-mcp', destination: '/mcp', permanent: true },
      { source: '/blog', destination: '/tin-tuc', permanent: true },
      {
        source: '/blog/:slug*',
        destination: '/tin-tuc/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
