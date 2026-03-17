"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils/cn"

function maskUsername(name: string): string {
  const maskCount = Math.ceil(name.length * 0.4)
  const visibleCount = name.length - maskCount
  return name.slice(0, visibleCount) + "*".repeat(maskCount)
}

function formatMinutesAgo(minutes: number): string {
  if (minutes <= 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const h = Math.floor(minutes / 60)
  return h === 1 ? "1 hour ago" : `${h} hours ago`
}

// isDownload: true means the action uses a real asset title at runtime
const activities = [
  { name: "svenvlogs",      location: "Amsterdam",    isDownload: false, minutesAgo: 1,  color: "#C9A96E" },
  { name: "JakeCreates",    location: "London",       isDownload: true,  minutesAgo: 3,  color: "#818CF8" },
  { name: "SophieCreates",  location: "Toronto",      isDownload: false, minutesAgo: 2,  color: "#34D399" },
  { name: "tyler_yt",       location: "Austin",       isDownload: true,  minutesAgo: 7,  color: "#4ADE80" },
  { name: "lena.yt",        location: "Munich",       isDownload: false, minutesAgo: 4,  color: "#A78BFA" },
  { name: "jordan.builds",  location: "New York",     isDownload: true,  minutesAgo: 5,  color: "#38BDF8" },
  { name: "MarcusBuilds",   location: "Berlin",       isDownload: false, minutesAgo: 6,  color: "#FB923C" },
  { name: "RyanFilms",      location: "Melbourne",    isDownload: true,  minutesAgo: 8,  color: "#FB923C" },
  { name: "aria_edits",     location: "Sydney",       isDownload: false, minutesAgo: 9,  color: "#F472B6" },
  { name: "mia_creates",    location: "Copenhagen",   isDownload: true,  minutesAgo: 10, color: "#F472B6" },
  { name: "nate.creator",   location: "Chicago",      isDownload: false, minutesAgo: 11, color: "#38BDF8" },
  { name: "sam.studio",     location: "Vancouver",    isDownload: true,  minutesAgo: 12, color: "#34D399" },
  { name: "YukiMedia",      location: "Tokyo",        isDownload: false, minutesAgo: 13, color: "#4ADE80" },
  { name: "AishaVlogs",     location: "Nairobi",      isDownload: true,  minutesAgo: 14, color: "#A78BFA" },
  { name: "priya_makes",    location: "Bangalore",    isDownload: false, minutesAgo: 16, color: "#F59E0B" },
  { name: "TariqMakes",     location: "Amsterdam",    isDownload: true,  minutesAgo: 15, color: "#10B981" },
  { name: "TobiasYT",       location: "Zurich",       isDownload: false, minutesAgo: 19, color: "#818CF8" },
  { name: "isabella_yt",    location: "Milan",        isDownload: true,  minutesAgo: 17, color: "#EC4899" },
  { name: "ChloeVlogs",     location: "Paris",        isDownload: false, minutesAgo: 25, color: "#10B981" },
  { name: "KenjiMedia",     location: "Osaka",        isDownload: true,  minutesAgo: 18, color: "#38BDF8" },
  { name: "diego_fx",       location: "Barcelona",    isDownload: false, minutesAgo: 28, color: "#F97316" },
  { name: "ingrid.yt",      location: "Oslo",         isDownload: true,  minutesAgo: 21, color: "#34D399" },
  { name: "EliasEdits",     location: "Stockholm",    isDownload: false, minutesAgo: 31, color: "#6366F1" },
  { name: "zoe.content",    location: "Edinburgh",    isDownload: true,  minutesAgo: 23, color: "#818CF8" },
  { name: "amara.content",  location: "Lagos",        isDownload: false, minutesAgo: 34, color: "#84CC16" },
  { name: "SimoneYT",       location: "Brussels",     isDownload: true,  minutesAgo: 24, color: "#E879F9" },
  { name: "OwenFilms",      location: "Dublin",       isDownload: false, minutesAgo: 37, color: "#14B8A6" },
  { name: "AndreYT",        location: "São Paulo",    isDownload: true,  minutesAgo: 26, color: "#6366F1" },
  { name: "hana_yt",        location: "Seoul",        isDownload: false, minutesAgo: 40, color: "#E879F9" },
  { name: "kim_creates",    location: "Auckland",     isDownload: true,  minutesAgo: 27, color: "#84CC16" },
  { name: "FelixMakes",     location: "Vienna",       isDownload: false, minutesAgo: 43, color: "#FB7185" },
  { name: "lukas_edits",    location: "Prague",       isDownload: true,  minutesAgo: 33, color: "#FB923C" },
  { name: "nia.studio",     location: "London",       isDownload: false, minutesAgo: 46, color: "#FBBF24" },
  { name: "layla_edits",    location: "Cairo",        isDownload: true,  minutesAgo: 35, color: "#F59E0B" },
  { name: "CalebCreates",   location: "Houston",      isDownload: true,  minutesAgo: 38, color: "#F472B6" },
  { name: "NoahBuilds",     location: "Toronto",      isDownload: true,  minutesAgo: 41, color: "#4ADE80" },
  { name: "mateus.edits",   location: "Lisbon",       isDownload: true,  minutesAgo: 44, color: "#14B8A6" },
  { name: "LinCreates",     location: "Shanghai",     isDownload: true,  minutesAgo: 20, color: "#FBBF24" },
  { name: "emre_fx",        location: "Istanbul",     isDownload: true,  minutesAgo: 32, color: "#F97316" },
  { name: "carlos.studio",  location: "Mexico City",  isDownload: true,  minutesAgo: 36, color: "#FB7185" },
  { name: "AlekseiMakes",   location: "Warsaw",       isDownload: true,  minutesAgo: 48, color: "#6366F1" },
]

const SHOW_DELAY = 4000   // initial delay before first toast
const VISIBLE_MS = 5500   // how long each toast is visible
const BETWEEN_MS = 9000   // gap between toasts

interface ActivityToastProps {
  assetTitles?: string[]
}

export function ActivityToast({ assetTitles = [] }: ActivityToastProps) {
  const [index,     setIndex]     = useState(0)
  const [visible,   setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)
  // Track when each toast was shown so we can compute realistic elapsed time
  const shownAtRef = useRef<number>(Date.now())

  useEffect(() => {
    if (dismissed) return
    setIndex(Math.floor(Math.random() * activities.length))
    const show = setTimeout(() => {
      shownAtRef.current = Date.now()
      setVisible(true)
    }, SHOW_DELAY)
    return () => clearTimeout(show)
  }, [dismissed])

  useEffect(() => {
    if (!visible || dismissed) return

    const hide = setTimeout(() => {
      setVisible(false)
      const next = setTimeout(() => {
        shownAtRef.current = Date.now()
        setIndex((i) => (i + 1) % activities.length)
        setVisible(true)
      }, BETWEEN_MS)
      return () => clearTimeout(next)
    }, VISIBLE_MS)

    return () => clearTimeout(hide)
  }, [visible, index, dismissed])

  const activity = activities[index]

  // Compute dynamic timestamp: base offset + time since page load
  const elapsedMinutes = Math.floor((Date.now() - shownAtRef.current) / 60000)
  const displayMinutes = activity.minutesAgo + elapsedMinutes
  const timeLabel = formatMinutesAgo(displayMinutes)

  const actionText = activity.isDownload && assetTitles.length > 0
    ? `downloaded ${assetTitles[index % assetTitles.length]}`
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
          style={{ backgroundColor: activity.color }}
        >
          {activity.name[0]}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs leading-snug text-content-primary">
            <span className="font-semibold">{maskUsername(activity.name)}</span>
            {" "}
            <span className="text-content-secondary">from {activity.location}</span>
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
