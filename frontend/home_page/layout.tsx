import type { Metadata } from "next"
 import Providers from "@/app/providers"

import { SiteNavbar } from "@/components/site-navbar"
import "./globals.css"
import { Poppins } from "next/font/google"

export const metadata: Metadata = {
  title: "ChainProof",
  description: "Supply chain transparency on-chain",
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} min-h-screen bg-gradient-to-br from-gray-900 via-[#0b0f17] to-black text-white`}>
        <Providers>
          <SiteNavbar />
          <main className="pb-24">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
