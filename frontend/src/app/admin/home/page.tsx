"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminHomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login?returnTo=/admin/home");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return (
    <section className="container py-10">
      <h2 className="text-3xl font-bold mb-4 text-white">Hello, {user.name ?? user.email ?? "Admin"}.</h2>
    </section>
  );
}
