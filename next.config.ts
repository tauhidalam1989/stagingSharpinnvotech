import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sharpinnovation-api.sharpinnvotech.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8093',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8093',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: 'https://sharpinnovation-api.sharpinnvotech.com/sitemap.xml',
      },
      {
        source: '/robots.txt',
        destination: 'https://sharpinnovation-api.sharpinnvotech.com/robots.txt',
      },
    ];
  },
};

export default nextConfig;