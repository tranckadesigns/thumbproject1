"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[80] h-[2px]"
      aria-hidden
    >
      <div
        className="h-full bg-accent"
        style={{ width: `${progress}%`, transition: "width 80ms linear" }}
      />
    </div>
  )
}
