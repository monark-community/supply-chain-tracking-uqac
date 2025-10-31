// src/app/layout.tsx
import type { Metadata } from "next";
import Providers from "@/app/providers"; // Global context/providers wrapper
import { SiteNavbar } from "@/components/site-navbar"; // Navbar component
import "./globals.css"; // Global CSS
import { Poppins } from "next/font/google"; // Google Fonts

// Metadata for the site (used by Next.js for SEO and page info)
export const metadata: Metadata = {
  title: "ChainProof", // Site title
  description: "Supply chain transparency on-chain", // Site description
};

// Load Poppins font with specific weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Normal, Semi-bold, Bold
});

// RootLayout component wraps the entire app
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Apply global font, min height, background gradient, and text color */}
      <body
        className={`${poppins.className} min-h-screen bg-gradient-to-br from-gray-900 via-[#0b0f17] to-black text-white`}
      >
        {/* Wrap the app with global providers (context, auth, etc.) */}
        <Providers>
          <SiteNavbar /> {/* Render the site navbar */}
          <main className="pb-24">
            {children} {/* Render the page content */}
          </main>
        </Providers>
      </body>
    </html>
  );
}
