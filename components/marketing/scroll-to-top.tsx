"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils/cn"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-accent/40 bg-base-elevated text-accent shadow-elevated transition-all duration-300 hover:bg-accent hover:text-base hover:border-accent",
        visible ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
