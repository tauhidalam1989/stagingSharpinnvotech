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
  experimental: {
    ...(process.env.NODE_ENV === 'development' && {
      allowedDevOrigins: ['http://88.222.244.10'], // Only for development
    }) as any, // Type assertion to bypass type-checking
  },
};

export default nextConfig;