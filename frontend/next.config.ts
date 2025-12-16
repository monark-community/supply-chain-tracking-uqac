import type { NextConfig } from "next";
import { join } from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable ESLint during production builds inside Docker so image builds succeed.
  // Linting still runs locally with `npm run dev` and `pnpm lint`.
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    root: __dirname, // __dirname = current directory (frontend)
  },
};

export default nextConfig;
