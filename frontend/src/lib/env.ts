export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Note:
// Next.js loads env files automatically:
// - npm/yarn/pnpm local dev: prefers .env.local
// - production build/docker: .env (and .env.production) via docker-compose
// Define NEXT_PUBLIC_API_URL in the appropriate file.