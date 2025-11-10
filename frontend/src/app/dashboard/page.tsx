"use client";

import { useUser } from "@auth0/nextjs-auth0/client"; // Auth0 hook for user info
import { useRouter } from "next/navigation"; // Next.js router for navigation
import { useEffect } from "react";
import DashboardClient from "./_client"; // The main dashboard component

export default function DashboardPage() {
  const { user, isLoading } = useUser(); // Get current user and loading state
  const router = useRouter();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login?returnTo=/dashboard"); // Redirect to login page
    }
  }, [user, isLoading, router]);

  // Show loading text while checking authentication
  if (isLoading || !user) 
    return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  // Render the dashboard once user is authenticated
  return <DashboardClient />;
}
