"use client"

import React from "react"

/**
 * Providers component acts as a wrapper for global context providers.
 * Currently, it just renders its children, but you can add Auth, Theme,
 * or other context providers here in the future.
 *
 * @param children - The React nodes to be wrapped by providers
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children} {/* Render the wrapped components */}
    </>
  )
}
