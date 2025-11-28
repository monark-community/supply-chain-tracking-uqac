import * as React from "react"

export function IconImmutable(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden focusable={false} {...props}>
      <rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function IconScan(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden focusable={false} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconTrace(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden focusable={false} {...props}>
      <path d="M4 12c1.5-4 6-6 10-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12c-1.5 4-6 6-10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="12" r="1.2" fill="currentColor" />
      <circle cx="18" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}
