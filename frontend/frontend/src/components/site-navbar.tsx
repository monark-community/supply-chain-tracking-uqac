"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export function SiteNavbar() {
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
          <Link href="/dashboard">Dashboard</Link>
          
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="secondary" className="hidden sm:inline-flex">
            <Link href="/about">Learn More</Link>
          </Button>
        <ConnectButton />
        </div>
      </div>
    </header>
  )
}
