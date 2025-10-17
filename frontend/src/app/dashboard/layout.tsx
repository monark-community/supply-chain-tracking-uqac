"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Truck,
  Factory,
  ShoppingBag,
  QrCode,
  BarChart3,
  Settings,
} from "lucide-react"
import { useProducts, ProductsProvider } from "@/context/products-context"

function Sidebar() {
  const pathname = usePathname()
  const { products } = useProducts()

  const totalProducts = products.length
  const inTransit = products.filter((p) => p.status === "In Transit").length
  const delivered = products.filter((p) => p.status === "Delivered").length
  const qrScans = totalProducts * 5 

  const menuItems = [
    { name: "Producer", href: "/dashboard", icon: Factory, badge: totalProducts },
    { name: "Transporter", href: "/transport", icon: Truck, badge: inTransit },
    { name: "Retailer", href: "/retail", icon: ShoppingBag, badge: delivered },
    { name: "QR Codes", href: "/scan-qr", icon: QrCode, badge: qrScans },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-gray-950/70 border-r border-white/10 p-6">
      <div className="flex items-center gap-2 mb-10">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h1 className="font-bold text-xl">ChainProof</h1>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition",
                active
                  ? "bg-primary/20 text-primary font-semibold"
                  : "hover:bg-white/10 text-white/80"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    active ? "text-primary" : "text-white/70"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProductsProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-[#0b0f17] to-black text-white">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </ProductsProvider>
  )
}
