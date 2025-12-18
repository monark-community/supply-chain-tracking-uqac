"use client";

export default function LoginButton() {
  const handleClick = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: "inline-block",
        padding: "8px 12px",
        borderRadius: 6,
        backgroundColor: "#2563eb",
        color: "#fff",
        textDecoration: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
