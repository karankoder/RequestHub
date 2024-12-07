import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // This will ignore TypeScript errors during build
  },
};

export default nextConfig;
