"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardClient from "@/components/admin/dashboard-client";

export default function AdminProductsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login?returnTo=/admin/products");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return (
    <section className="container py-10">
      <DashboardClient />
    </section>
  );
}
