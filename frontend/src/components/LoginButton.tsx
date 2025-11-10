"use client";

import Link from "next/link";

export default function LoginButton() {
  const handleClick = () => {
    // petit délai pour laisser Auth0 rediriger, puis on recharge la page
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Link
      href="/api/auth/login"
      onClick={handleClick}
      style={{
        display: "inline-block",
        padding: "8px 12px",
        borderRadius: 6,
        backgroundColor: "#2563eb",
        color: "#fff",
        textDecoration: "none",
      }}
    >
      Login
    </Link>
  );
}
