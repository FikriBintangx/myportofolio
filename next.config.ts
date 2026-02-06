import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence warning
  // Turbopack handles .glb and image files by default
  turbopack: {},
};

export default nextConfig;
