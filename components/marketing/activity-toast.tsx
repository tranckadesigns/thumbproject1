"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils/cn"

function maskUsername(name: string): string {
  const maskCount = Math.ceil(name.length * 0.4)
  const visibleCount = name.length - maskCount
  return name.slice(0, visibleCount) + "*".repeat(maskCount)
}

// isDownload: true means the action uses a real asset title at runtime
// Interleaved so subscriptions and downloads alternate — no long runs of either
const activities = [
  { name: "svenvlogs",      location: "Amsterdam",    isDownload: false, time: "1 min ago",  color: "#C9A96E" },
  { name: "JakeCreates",    location: "London",       isDownload: true,  time: "3 min ago",  color: "#818CF8" },
  { name: "SophieCreates",  location: "Toronto",      isDownload: false, time: "2 min ago",  color: "#34D399" },
  { name: "tyler_yt",       location: "Austin",       isDownload: true,  time: "7 min ago",  color: "#4ADE80" },
  { name: "lena.yt",        location: "Munich",       isDownload: false, time: "4 min ago",  color: "#A78BFA" },
  { name: "jordan.builds",  location: "New York",     isDownload: true,  time: "5 min ago",  color: "#38BDF8" },
  { name: "MarcusBuilds",   location: "Berlin",       isDownload: false, time: "6 min ago",  color: "#FB923C" },
  { name: "RyanFilms",      location: "Melbourne",    isDownload: true,  time: "8 min ago",  color: "#FB923C" },
  { name: "aria_edits",     location: "Sydney",       isDownload: false, time: "9 min ago",  color: "#F472B6" },
  { name: "mia_creates",    location: "Copenhagen",   isDownload: true,  time: "10 min ago", color: "#F472B6" },
  { name: "nate.creator",   location: "Chicago",      isDownload: false, time: "11 min ago", color: "#38BDF8" },
  { name: "sam.studio",     location: "Vancouver",    isDownload: true,  time: "12 min ago", color: "#34D399" },
  { name: "YukiMedia",      location: "Tokyo",        isDownload: false, time: "13 min ago", color: "#4ADE80" },
  { name: "AishaVlogs",     location: "Nairobi",      isDownload: true,  time: "14 min ago", color: "#A78BFA" },
  { name: "priya_makes",    location: "Bangalore",    isDownload: false, time: "16 min ago", color: "#F59E0B" },
  { name: "TariqMakes",     location: "Amsterdam",    isDownload: true,  time: "15 min ago", color: "#10B981" },
  { name: "TobiasYT",       location: "Zurich",       isDownload: false, time: "19 min ago", color: "#818CF8" },
  { name: "isabella_yt",    location: "Milan",        isDownload: true,  time: "17 min ago", color: "#EC4899" },
  { name: "ChloeVlogs",     location: "Paris",        isDownload: false, time: "25 min ago", color: "#10B981" },
  { name: "KenjiMedia",     location: "Osaka",        isDownload: true,  time: "18 min ago", color: "#38BDF8" },
  { name: "diego_fx",       location: "Barcelona",    isDownload: false, time: "28 min ago", color: "#F97316" },
  { name: "ingrid.yt",      location: "Oslo",         isDownload: true,  time: "21 min ago", color: "#34D399" },
  { name: "EliasEdits",     location: "Stockholm",    isDownload: false, time: "31 min ago", color: "#6366F1" },
  { name: "zoe.content",    location: "Edinburgh",    isDownload: true,  time: "23 min ago", color: "#818CF8" },
  { name: "amara.content",  location: "Lagos",        isDownload: false, time: "34 min ago", color: "#84CC16" },
  { name: "SimoneYT",       location: "Brussels",     isDownload: true,  time: "24 min ago", color: "#E879F9" },
  { name: "OwenFilms",      location: "Dublin",       isDownload: false, time: "37 min ago", color: "#14B8A6" },
  { name: "AndreYT",        location: "São Paulo",    isDownload: true,  time: "26 min ago", color: "#6366F1" },
  { name: "hana_yt",        location: "Seoul",        isDownload: false, time: "40 min ago", color: "#E879F9" },
  { name: "kim_creates",    location: "Auckland",     isDownload: true,  time: "27 min ago", color: "#84CC16" },
  { name: "FelixMakes",     location: "Vienna",       isDownload: false, time: "43 min ago", color: "#FB7185" },
  { name: "lukas_edits",    location: "Prague",       isDownload: true,  time: "33 min ago", color: "#FB923C" },
  { name: "nia.studio",     location: "London",       isDownload: false, time: "46 min ago", color: "#FBBF24" },
  { name: "layla_edits",    location: "Cairo",        isDownload: true,  time: "35 min ago", color: "#F59E0B" },
  { name: "CalebCreates",   location: "Houston",      isDownload: true,  time: "38 min ago", color: "#F472B6" },
  { name: "NoahBuilds",     location: "Toronto",      isDownload: true,  time: "41 min ago", color: "#4ADE80" },
  { name: "mateus.edits",   location: "Lisbon",       isDownload: true,  time: "44 min ago", color: "#14B8A6" },
  { name: "LinCreates",     location: "Shanghai",     isDownload: true,  time: "20 min ago", color: "#FBBF24" },
  { name: "emre_fx",        location: "Istanbul",     isDownload: true,  time: "32 min ago", color: "#F97316" },
  { name: "carlos.studio",  location: "Mexico City",  isDownload: true,  time: "36 min ago", color: "#FB7185" },
  { name: "AlekseiMakes",   location: "Warsaw",       isDownload: true,  time: "48 min ago", color: "#6366F1" },
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

  useEffect(() => {
    if (dismissed) return
    setIndex(Math.floor(Math.random() * activities.length))
    const show = setTimeout(() => setVisible(true), SHOW_DELAY)
    return () => clearTimeout(show)
  }, [dismissed])

  useEffect(() => {
    if (!visible || dismissed) return

    const hide = setTimeout(() => {
      setVisible(false)
      const next = setTimeout(() => {
        setIndex((i) => (i + 1) % activities.length)
        setVisible(true)
      }, BETWEEN_MS)
      return () => clearTimeout(next)
    }, VISIBLE_MS)

    return () => clearTimeout(hide)
  }, [visible, index, dismissed])

  const activity = activities[index]

  // Resolve action text — downloads use a real asset title if available
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
          <p className="mt-1 text-[10px] text-content-muted">{activity.time}</p>
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
