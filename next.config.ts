import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { 
        protocol: "https", 
        hostname: "res.cloudinary.com"
      },
    ]
  },
  webpack: (config, { isServer }) => {
        // Only apply this configuration when using Webpack
        // (not needed for Turbopack)
        if (!process.env.TURBOPACK) {
            config.module.rules.push({
                test: /\.node$/,
                use: 'raw-loader',
            });
        }
        
        return config;
    },
};

export default nextConfig;
