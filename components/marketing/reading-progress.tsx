"use client"

import { useEffect, useRef } from "react"

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      const progress = total > 0 ? (el.scrollTop / total) * 100 : 0
      if (barRef.current) {
        barRef.current.style.width = `${progress}%`
      }
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
        ref={barRef}
        className="h-full bg-accent"
        style={{ width: "0%", willChange: "width" }}
      />
    </div>
  )
}
