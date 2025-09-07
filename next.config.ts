import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-063b4094a46345659aa65fe70448a864.r2.dev'
            }
        ]
    }
};

export default nextConfig;
