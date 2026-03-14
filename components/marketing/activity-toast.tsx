"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils/cn"

const activities = [
  // Subscriptions
  { name: "Sven",       location: "Amsterdam",    action: "just subscribed",                      time: "1 min ago",  color: "#C9A96E" },
  { name: "Sophie",     location: "Toronto",      action: "just subscribed",                      time: "2 min ago",  color: "#34D399" },
  { name: "Lena",       location: "Munich",       action: "just subscribed",                      time: "4 min ago",  color: "#A78BFA" },
  { name: "Marcus",     location: "Berlin",       action: "just subscribed",                      time: "6 min ago",  color: "#FB923C" },
  { name: "Aria",       location: "Sydney",       action: "just subscribed",                      time: "9 min ago",  color: "#F472B6" },
  { name: "Nate",       location: "Chicago",      action: "just subscribed",                      time: "11 min ago", color: "#38BDF8" },
  { name: "Yuki",       location: "Tokyo",        action: "just subscribed",                      time: "13 min ago", color: "#4ADE80" },
  { name: "Priya",      location: "Bangalore",    action: "just subscribed",                      time: "16 min ago", color: "#F59E0B" },
  { name: "Tobias",     location: "Zurich",       action: "just subscribed",                      time: "19 min ago", color: "#818CF8" },
  { name: "Mei",        location: "Singapore",    action: "just subscribed",                      time: "22 min ago", color: "#EC4899" },
  { name: "Chloe",      location: "Paris",        action: "just subscribed",                      time: "25 min ago", color: "#10B981" },
  { name: "Diego",      location: "Barcelona",    action: "just subscribed",                      time: "28 min ago", color: "#F97316" },
  { name: "Elias",      location: "Stockholm",    action: "just subscribed",                      time: "31 min ago", color: "#6366F1" },
  { name: "Amara",      location: "Lagos",        action: "just subscribed",                      time: "34 min ago", color: "#84CC16" },
  { name: "Owen",       location: "Dublin",       action: "just subscribed",                      time: "37 min ago", color: "#14B8A6" },
  { name: "Hana",       location: "Seoul",        action: "just subscribed",                      time: "40 min ago", color: "#E879F9" },
  { name: "Felix",      location: "Vienna",       action: "just subscribed",                      time: "43 min ago", color: "#FB7185" },
  { name: "Nia",        location: "London",       action: "just subscribed",                      time: "46 min ago", color: "#FBBF24" },
  // Downloads — Revenue
  { name: "Jake",       location: "London",       action: "downloaded Revenue Alert",             time: "3 min ago",  color: "#818CF8" },
  { name: "Tyler",      location: "Austin",       action: "downloaded Revenue Alert",             time: "7 min ago",  color: "#4ADE80" },
  { name: "Kenji",      location: "Osaka",        action: "downloaded Revenue Alert",             time: "18 min ago", color: "#38BDF8" },
  { name: "Fatima",     location: "Dubai",        action: "downloaded Revenue Alert",             time: "29 min ago", color: "#C9A96E" },
  // Downloads — Subscribers
  { name: "Jordan",     location: "New York",     action: "downloaded Subscriber Milestone",      time: "5 min ago",  color: "#38BDF8" },
  { name: "Aisha",      location: "Nairobi",      action: "downloaded Subscriber Milestone",      time: "14 min ago", color: "#A78BFA" },
  { name: "Lukas",      location: "Prague",       action: "downloaded Subscriber Milestone",      time: "33 min ago", color: "#FB923C" },
  // Downloads — Timers
  { name: "Ryan",       location: "Melbourne",    action: "downloaded Countdown Timer",           time: "8 min ago",  color: "#FB923C" },
  { name: "Ingrid",     location: "Oslo",         action: "downloaded Countdown Timer",           time: "21 min ago", color: "#34D399" },
  { name: "Caleb",      location: "Houston",      action: "downloaded Countdown Timer",           time: "38 min ago", color: "#F472B6" },
  // Downloads — Challenges
  { name: "Mia",        location: "Copenhagen",   action: "downloaded Challenge Progress Bar",    time: "10 min ago", color: "#F472B6" },
  { name: "Andre",      location: "São Paulo",    action: "downloaded Challenge Progress Bar",    time: "26 min ago", color: "#6366F1" },
  // Downloads — Comparisons
  { name: "Sam",        location: "Vancouver",    action: "downloaded Best vs Worst Comparison",  time: "12 min ago", color: "#34D399" },
  { name: "Layla",      location: "Cairo",        action: "downloaded Best vs Worst Comparison",  time: "35 min ago", color: "#F59E0B" },
  // Downloads — Analytics
  { name: "Tariq",      location: "Amsterdam",    action: "downloaded CTR Analytics Card",        time: "15 min ago", color: "#10B981" },
  { name: "Zoe",        location: "Edinburgh",    action: "downloaded Watch Time Graph",          time: "23 min ago", color: "#818CF8" },
  { name: "Noah",       location: "Toronto",      action: "downloaded Growth Chart Overlay",      time: "41 min ago", color: "#4ADE80" },
  // Downloads — Social
  { name: "Isabella",   location: "Milan",        action: "downloaded Instagram Social Proof",    time: "17 min ago", color: "#EC4899" },
  { name: "Mateus",     location: "Lisbon",       action: "downloaded Instagram Social Proof",    time: "44 min ago", color: "#14B8A6" },
  // Downloads — E-Commerce
  { name: "Lin",        location: "Shanghai",     action: "downloaded Shopify Sales Dashboard",   time: "20 min ago", color: "#FBBF24" },
  { name: "Emre",       location: "Istanbul",     action: "downloaded Course Enrollment Counter", time: "32 min ago", color: "#F97316" },
  // Downloads — Reactions / Ratings
  { name: "Simone",     location: "Brussels",     action: "downloaded Reaction Bubbles",          time: "24 min ago", color: "#E879F9" },
  { name: "Carlos",     location: "Mexico City",  action: "downloaded Star Rating Popup",         time: "36 min ago", color: "#FB7185" },
  // Downloads — Alerts
  { name: "Kim",        location: "Auckland",     action: "downloaded Breaking News Alert",       time: "27 min ago", color: "#84CC16" },
  { name: "Aleksei",    location: "Warsaw",       action: "downloaded Live Alert Banner",         time: "48 min ago", color: "#6366F1" },
]

const SHOW_DELAY = 4000   // initial delay before first toast
const VISIBLE_MS = 5500   // how long each toast is visible
const BETWEEN_MS = 9000   // gap between toasts

export function ActivityToast() {
  const [index,     setIndex]     = useState(0)
  const [visible,   setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    // randomize start index after mount to avoid hydration mismatch
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
            <span className="font-semibold">{activity.name}</span>
            {" "}
            <span className="text-content-secondary">from {activity.location}</span>
          </p>
          <p className="mt-0.5 text-xs text-content-secondary">{activity.action}</p>
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
