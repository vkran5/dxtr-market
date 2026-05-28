import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "cryptoicons.org",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://fe-technical-assignment.dxtr.asia/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
