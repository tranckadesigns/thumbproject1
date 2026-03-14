import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils/cn"

// Running total timeline — each row shows cumulative asset count growing over time
const feed = [
  { date: "Oct 2025", count: 4, total: 12, categories: ["Subscribers", "Growth", "Ratings", "Reactions"], isNew: false },
  { date: "Nov 2025", count: 3, total: 15, categories: ["Analytics", "Comparisons", "E-Commerce"], isNew: false },
  { date: "Dec 2025", count: 4, total: 19, categories: ["Social", "Challenges", "Revenue", "Timers"], isNew: false },
  { date: "Jan 2026", count: 3, total: 22, categories: ["Growth", "Alerts", "Subscribers"], isNew: false },
  { date: "Feb 2026", count: 4, total: 26, categories: ["Ratings", "Analytics", "Reactions", "E-Commerce"], isNew: true },
  { date: "Mar 2026", count: 3, total: 29, categories: ["Comparisons", "Revenue", "Challenges"], isNew: true },
]

const MAX_TOTAL = 29

export function LibraryGrowthV6() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              Always growing
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              New assets. Every month.
              <br />Included in your subscription.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-content-secondary">
              Every asset added is yours automatically — no upgrades, no extra cost, forever.
            </p>
          </div>
        </Reveal>

        <div className="relative">
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-3">
            {feed.map(({ date, count, total, categories, isNew }, i) => {
              const fillPct = Math.round((total / MAX_TOTAL) * 100)
              return (
                <Reveal key={date} delay={i * 60}>
                  <div className="flex items-start gap-6">
                    {/* Date */}
                    <div className="w-16 shrink-0 pt-3.5 text-right">
                      <p className="text-[10px] font-medium leading-tight text-content-muted">
                        {date.split(" ")[0]}
                        <br />
                        {date.split(" ")[1]}
                      </p>
                    </div>

                    {/* Dot */}
                    <div className="relative z-10 mt-3.5 flex h-3 w-3 shrink-0 items-center justify-center">
                      <div className={cn(
                        "h-2.5 w-2.5 rounded-full border-2",
                        isNew ? "border-accent bg-accent" : "border-border bg-base"
                      )} />
                    </div>

                    {/* Card with progress fill */}
                    <div className={cn(
                      "relative flex-1 overflow-hidden rounded-xl border p-4",
                      isNew ? "border-accent/20 bg-accent/[0.03]" : "border-border bg-base-surface"
                    )}>
                      {/* Background fill strip */}
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-y-0 left-0 rounded-xl transition-all",
                          isNew ? "bg-accent/[0.06]" : "bg-border/20"
                        )}
                        style={{ width: `${fillPct}%` }}
                      />

                      <div className="relative flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className={cn(
                            "text-sm font-bold tracking-tight",
                            isNew ? "text-accent" : "text-content-primary"
                          )}>
                            +{count} assets
                          </span>
                          <span className="text-content-muted/30">·</span>
                          <span className="text-xs text-content-muted">
                            {categories.join(", ")}
                          </span>
                        </div>

                        {/* Running total */}
                        <div className="shrink-0 text-right">
                          <span className={cn(
                            "text-sm font-bold tabular-nums",
                            isNew ? "text-accent" : "text-content-muted"
                          )}>
                            {total}
                          </span>
                          <span className="ml-0.5 text-[10px] text-content-muted/50"> total</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        <Reveal delay={420}>
          <p className="mt-8 text-center text-sm text-content-muted">
            Every new asset is included in all existing subscriptions — no extra cost, no action needed.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
