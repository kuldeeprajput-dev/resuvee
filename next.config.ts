import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.19", "192.168.1.19:3000"],
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.19",
        port: "3000",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui", "clsx", "tailwind-merge"],
    serverActions: {
      allowedOrigins: ["localhost:3000", "192.168.1.19:3000"],
    },
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
