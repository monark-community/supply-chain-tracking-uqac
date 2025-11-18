"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Factory, Users, Layers, FileText, Box, Database } from "lucide-react";
import { useProducts, ProductsProvider } from "@/context/products-context";
import { UserProvider } from "@auth0/nextjs-auth0/client";

function Sidebar() {
  const pathname = usePathname();
  const { products } = useProducts();
  const totalProducts = products.length;

  const menuItems = [
    { name: "Home", href: "/admin/home", icon: Factory },
    { name: "Products", href: "/admin/products", icon: Factory, badge: totalProducts },
    { name: "Actors", href: "/admin/actors", icon: Users },
    { name: "Contacts", href: "/admin/contacts", icon: FileText },
    { name: "Product Categories", href: "/admin/product-categories", icon: Layers },
    { name: "Actor Categories", href: "/admin/actor-categories", icon: Database },
    { name: "Units", href: "/admin/units", icon: Box },
    { name: "Transactions", href: "/admin/transactions", icon: Factory },
  ];

  return (
    <aside className="w-64 border-r border-white/10 p-6">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition",
                active
                  ? "bg-white/20 text-white font-semibold"
                  : "hover:bg-gray-400 text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", "text-white")} />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-white/20 text-white font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ProductsProvider>
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-[#0b0f17] to-black text-white">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
      </ProductsProvider>
    </UserProvider>
  );
}
