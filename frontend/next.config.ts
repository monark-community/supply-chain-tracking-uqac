import type { NextConfig } from "next";
import { join } from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname, // __dirname = current directory (frontend)
  },
};

export default nextConfig;
