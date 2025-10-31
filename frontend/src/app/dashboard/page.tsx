"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardClient from "./_client";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login?returnTo=/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return <DashboardClient />;
}
