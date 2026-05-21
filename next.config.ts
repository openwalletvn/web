import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},

  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:pair([^/]*-vs-[^/]*)',
        destination: '/so-sanh/:pair',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
