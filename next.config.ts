import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Windows: webpack filesystem cache uses atomic renames under .next/cache/webpack;
  // antivirus/sync/locking often causes ENOENT on rename and flaky dev CSS/JS.
  // In-memory cache avoids PackFileCacheStrategy disk writes (slightly slower cold starts).
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },
};

export default nextConfig;
