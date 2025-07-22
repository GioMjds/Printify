import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  allowedDevOrigins: [
    '*',
  ],
  serverExternalPackages: ['ws', '@prisma/client'],
  output: 'standalone'
};

export default nextConfig;
