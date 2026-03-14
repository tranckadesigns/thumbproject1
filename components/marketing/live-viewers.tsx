"use client"

import { useEffect, useState } from "react"

export function LiveViewers() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const initial = Math.floor(Math.random() * 38) + 24 // 24–61
    setCount(initial)

    const schedule = () => {
      const delay = 9000 + Math.random() * 8000 // every 9–17s
      return setTimeout(() => {
        setCount(prev => {
          if (prev === null) return prev
          const delta = Math.floor(Math.random() * 5) - 2 // –2 to +2
          return Math.min(Math.max(prev + delta, 14), 78)
        })
        timer = schedule()
      }, delay)
    }

    let timer = schedule()
    return () => clearTimeout(timer)
  }, [])

  if (count === null) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-content-muted">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      {count} people viewing right now
    </span>
  )
}
