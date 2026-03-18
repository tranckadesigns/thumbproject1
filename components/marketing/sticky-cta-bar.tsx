"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils/cn"
import { buttonVariants } from "@/components/ui/button"

const SCROLL_THRESHOLD = 700

export function StickyCTABar({ hasSubscription }: { hasSubscription?: boolean }) {
  const [visible,   setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(() =>
    typeof window !== "undefined" && sessionStorage.getItem("cta-bar-dismissed") === "1"
  )

  function dismiss() {
    sessionStorage.setItem("cta-bar-dismissed", "1")
    setDismissed(true)
  }

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed) setVisible(window.scrollY > SCROLL_THRESHOLD)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [dismissed])

  if (hasSubscription) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-base/90 backdrop-blur-md transition-all duration-300",
        visible && !dismissed
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <p className="hidden text-sm text-content-secondary sm:block">
          <span className="font-semibold text-content-primary">PSDfuel</span>
          {" · "}Full library access · Commercial license · New assets monthly
        </p>

        <div className="flex flex-1 items-center justify-between gap-3 sm:flex-none sm:justify-end">
          <p className="text-sm font-semibold text-content-primary sm:hidden">
            From <span className="text-accent">$30</span>/month
          </p>
          <div className="flex items-center gap-2">
            <p className="hidden text-sm font-semibold text-accent sm:block">
              From $30/month
            </p>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
            >
              Get access
            </Link>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="shrink-0 text-content-muted/40 transition-colors hover:text-content-muted"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
