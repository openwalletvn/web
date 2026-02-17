import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.openwallet.vn',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
      },
    ],
  },
};

export default nextConfig;
