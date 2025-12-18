// SiteNavbar.tsx
"use client";

import Link from "next/link";

/**
 * SiteNavbar component renders the top navigation bar.
 * It handles authentication state and displays links/buttons accordingly.
 *
 * @param dashboard - Optional boolean to hide certain links when in dashboard
 */
export function SiteNavbar({ dashboard = false }: { dashboard?: boolean }) {
  // No pre-check: render the navbar immediately (remove initial /api/auth/me verification)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-bg/60 backdrop-blur">
      <div className="container h-14 flex items-center justify-between">
        {/* Logo and site name */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-accent shadow-glow" />
          <span className="font-semibold">ChainProof</span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {!dashboard && (
            <>
              {/* Public site links */}
              <Link href="/#features">Features</Link>
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/scan-qr">Scan QR</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
