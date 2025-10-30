"use client";

import Link from "next/link";

export default function LoginButton() {
  return (
    <Link
      href="/api/auth/login"
      style={{
        display: "inline-block",
        padding: "8px 12px",
        borderRadius: 6,
        backgroundColor: "#2563eb",
        color: "#fff",
        textDecoration: "none",
      }}
    >
      Se connecter
    </Link>
  );
}
