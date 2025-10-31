"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Utility function for conditional class names
import { Factory } from "lucide-react"; // Icon for menu
import { useProducts, ProductsProvider } from "@/context/products-context"; // Products context
import { UserProvider } from "@auth0/nextjs-auth0/client"; // Auth0 user context

// Sidebar component displaying navigation menu
function Sidebar() {
  const pathname = usePathname(); // Get current URL path to highlight active link
  const { products } = useProducts(); // Access products from context

  const totalProducts = products.length; // Compute total number of products

  // Define menu items with optional badge count
  const menuItems = [
    { name: "Products", href: "/dashboard", icon: Factory, badge: totalProducts },
  ];

  return (
    <aside className="w-64 border-r border-white/10 p-6">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const active = pathname === item.href; // Determine if menu item is active
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition",
                active
                  ? "bg-white/20 text-white font-semibold" // Active item style
                  : "hover:bg-gray-400 text-white" // Hover style for inactive items
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    "text-white" // Icon color
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-white/20 text-white font-medium">
                  {item.badge} {/* Display badge count */}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Main dashboard layout wrapping children with context providers
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider> {/* Provide Auth0 authentication context */}
      <ProductsProvider> {/* Provide products data context */}
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-[#0b0f17] to-black text-white">
          <Sidebar /> {/* Render the sidebar */}
          <main className="flex-1 p-8 overflow-y-auto">
            {children} {/* Render page content passed as children */}
          </main>
        </div>
      </ProductsProvider>
    </UserProvider>
  );
}
