import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false, // Consistent URL format: /blog/post (not /blog/post/)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'go.dev',
      },
    ],
  },
};

export default nextConfig;
