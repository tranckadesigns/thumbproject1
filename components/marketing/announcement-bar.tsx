"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const STORAGE_KEY = "psdfuel-announcement-v1"

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="flex items-center justify-center gap-2.5 border-b border-accent/15 bg-accent/[0.06] px-4 py-2 text-xs">
      {/* Pulsing dot */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>

      <p className="text-content-secondary">
        <span className="font-medium text-content-primary">Founding member pricing</span>
        {" — "}lock in <span className="font-semibold text-accent">$19/mo</span> forever before we raise prices.{" "}
        <Link
          href="/pricing"
          className="font-medium text-content-primary underline underline-offset-2 transition-colors hover:text-accent"
        >
          Claim your spot →
        </Link>
      </p>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="ml-1 shrink-0 text-content-muted/40 transition-colors hover:text-content-muted"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
