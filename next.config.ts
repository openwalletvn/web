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
      // category paths — must be before generic /cards/:slug* rule
      { source: '/cards', destination: '/the', permanent: true },
      { source: '/cards/credit', destination: '/loai-the/the-tin-dung', permanent: true },
      { source: '/cards/debit', destination: '/loai-the/the-ghi-no', permanent: true },
      { source: '/cards/2in1', destination: '/the-2-trong-1', permanent: true },
      { source: '/cards/visa', destination: '/the', permanent: true },
      { source: '/cards/mastercard', destination: '/the', permanent: true },
      { source: '/cards/amex', destination: '/the', permanent: true },
      { source: '/cards/jcb', destination: '/the', permanent: true },
      { source: '/cards/napas', destination: '/the', permanent: true },
      { source: '/cards/unionpay', destination: '/the', permanent: true },
      { source: '/cards/networks/:path*', destination: '/the', permanent: true },
      { source: '/cards/co-branded/:path*', destination: '/the', permanent: true },
      // generic card slug — after category rules
      {
        source: '/cards/:slug*',
        destination: '/the/:slug*',
        permanent: true,
      },
      // card type pages — old flat URLs redirect to new /loai-the/* structure
      { source: '/the-tin-dung', destination: '/loai-the/the-tin-dung', permanent: true },
      { source: '/the-ghi-no', destination: '/loai-the/the-ghi-no', permanent: true },
      { source: '/the-hybrid', destination: '/loai-the/the-hybrid', permanent: true },
      { source: '/cards/hybrid', destination: '/loai-the/the-hybrid', permanent: true },
      // persona pages — old flat URLs redirect to nested structure
      { source: '/the-shopee', destination: '/the-theo-nhu-cau/shopee', permanent: true },
      { source: '/the-sieu-thi', destination: '/the-theo-nhu-cau/sieu-thi', permanent: true },
      { source: '/the-chi-tieu-dich-vu-so', destination: '/the-theo-nhu-cau/dich-vu-so', permanent: true },
      { source: '/the-danh-cho-giao-duc', destination: '/the-theo-nhu-cau/gia-dinh', permanent: true },
      { source: '/the-danh-cho-y-te', destination: '/the-theo-nhu-cau/gia-dinh', permanent: true },
      { source: '/the-danh-cho-bao-hiem', destination: '/the-theo-nhu-cau/gia-dinh', permanent: true },
      { source: '/the-doanh-nghiep', destination: '/the-theo-nhu-cau/doanh-nghiep', permanent: true },
      { source: '/banks', destination: '/ngan-hang', permanent: true },
      {
        source: '/banks/:slug*',
        destination: '/ngan-hang/:slug*',
        permanent: true,
      },
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
