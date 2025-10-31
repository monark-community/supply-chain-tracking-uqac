// SiteNavbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

// Type for the current user info returned from /api/auth/me
type Me = { user?: { name?: string; email?: string } } | null;

/**
 * SiteNavbar component renders the top navigation bar.
 * It handles authentication state and displays links/buttons accordingly.
 *
 * @param dashboard - Optional boolean to hide certain links when in dashboard
 */
export function SiteNavbar({ dashboard = false }: { dashboard?: boolean }) {
  const [me, setMe] = useState<Me>(null);       // User data state
  const [loading, setLoading] = useState(true); // Loading state while fetching user

  // Fetch the current authenticated user from the server
  useEffect(() => {
    let cancelled = false; // To prevent state update after unmount
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" }); // Get user info
        const data = res.ok ? await res.json() : null;
        if (!cancelled) setMe(data);
      } catch {
        if (!cancelled) setMe(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true; // Cancel the async update on unmount
    };
  }, []);

  const isAuth = !!me?.email; // Boolean to check if user is logged in

  if (loading) return null; // Do not render navbar while loading

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
              <Link href="/features">Features</Link>
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/scan-qr">Scan QR</Link>
              {!isAuth && <LoginButton />} {/* Show login if not authenticated */}
            </>
          )}

          {isAuth && <LogoutButton />} {/* Show logout if authenticated */}
        </nav>
      </div>
    </header>
  );
}
