import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // This creates the static folder
  images: {
    unoptimized: true, // Extensions don't support Next.js Image optimization
  },
};

export default nextConfig;
