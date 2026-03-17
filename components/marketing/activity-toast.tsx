"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils/cn"

interface ActivityEvent {
  type: "download" | "subscription"
  maskedName: string
  assetTitle?: string
  minutesAgo: number
  color: string
}

function formatMinutesAgo(minutes: number): string {
  if (minutes <= 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const h = Math.min(48, Math.floor(minutes / 60))
  return h === 1 ? "1 hour ago" : `${h} hours ago`
}

const SHOW_DELAY  = 4000  // delay before first toast
const VISIBLE_MS  = 5500  // how long each toast stays visible
const BETWEEN_MS  = 9000  // gap between toasts

export function ActivityToast() {
  const [events,    setEvents]    = useState<ActivityEvent[]>([])
  const [index,     setIndex]     = useState(0)
  const [visible,   setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const shownAtRef = useRef<number>(Date.now())

  // Fetch real data once on mount
  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: ActivityEvent[]) => setEvents(data))
      .catch(() => {/* no data = no toast */})
  }, [])

  // Start cycling once we have events
  useEffect(() => {
    if (events.length === 0 || dismissed) return
    setIndex(Math.floor(Math.random() * events.length))
    const show = setTimeout(() => {
      shownAtRef.current = Date.now()
      setVisible(true)
    }, SHOW_DELAY)
    return () => clearTimeout(show)
  }, [events, dismissed])

  useEffect(() => {
    if (!visible || dismissed) return
    const hide = setTimeout(() => {
      setVisible(false)
      const next = setTimeout(() => {
        shownAtRef.current = Date.now()
        setIndex((i) => (i + 1) % events.length)
        setVisible(true)
      }, BETWEEN_MS)
      return () => clearTimeout(next)
    }, VISIBLE_MS)
    return () => clearTimeout(hide)
  }, [visible, index, dismissed, events.length])

  if (events.length === 0) return null

  const event = events[index]
  const elapsedMinutes = Math.floor((Date.now() - shownAtRef.current) / 60000)
  const timeLabel = formatMinutesAgo(event.minutesAgo + elapsedMinutes)
  const actionText = event.type === "download" && event.assetTitle
    ? `downloaded ${event.assetTitle}`
    : "just subscribed"

  return (
    <div
      className={cn(
        "fixed bottom-6 left-5 z-50 w-72 transition-all duration-500",
        visible && !dismissed
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <div className="flex items-start gap-3 rounded-xl border border-border bg-base-elevated px-4 py-3 shadow-elevated">
        {/* Avatar */}
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-base"
          style={{ backgroundColor: event.color }}
        >
          {event.maskedName[0].toUpperCase()}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs leading-snug text-content-primary">
            <span className="font-semibold">{event.maskedName}</span>
          </p>
          <p className="mt-0.5 text-xs text-content-secondary">{actionText}</p>
          <p className="mt-1 text-xs text-content-muted">{timeLabel}</p>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="mt-0.5 text-content-muted/40 transition-colors hover:text-content-muted"
          aria-label="Dismiss"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
