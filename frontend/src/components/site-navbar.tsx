// src/components/site-navbar.tsx
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import LoginButton from './LoginButton';

export default function AuthPage() {
  return (
    <div>
      <h1>Se connecter</h1>
      <LoginButton />
    </div>
  );
}

type Me = { user?: { name?: string; email?: string } } | null

export function SiteNavbar() {
  const [me, setMe] = useState<Me>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        const data = res.ok ? await res.json() : null
        if (!cancelled) setMe(data)
      } catch {
        if (!cancelled) setMe(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const isAuth = !!me?.user

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-bg/60 backdrop-blur">
      <div className="container h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-accent shadow-glow" />
          <span className="font-semibold">ChainProof</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/features">Features</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/scan-qr">Scan QR</Link>
          {!loading && !isAuth && (
            <Link href="/auth" className="px-3 py-1 rounded-md border border-white/15 hover:bg-white/10">
              Login
            </Link>
          )}
          {!loading && isAuth && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <a
                href="/api/auth/logout"
                className="px-3 py-1 rounded-md border border-white/15 hover:bg-white/10"
              >
                Logout
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
