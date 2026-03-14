"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils/cn"
import { buttonVariants } from "@/components/ui/button"

const STORAGE_KEY = "psdfuel-cookie-consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted")
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined")
    setVisible(false)
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-5 z-50 w-80 transition-all duration-500",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <div className="rounded-xl border border-border bg-base-elevated px-5 py-4 shadow-elevated">
        <p className="text-xs font-semibold text-content-primary">Cookies</p>
        <p className="mt-1.5 text-xs leading-relaxed text-content-muted">
          We use cookies for analytics and to improve your experience. See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-content-secondary">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={accept}
            className={cn(buttonVariants({ size: "sm" }), "flex-1 justify-center")}
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-content-muted transition-colors hover:border-border-strong hover:text-content-primary"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
