import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils/cn"

// Featured + compact — newest entries are big cards, older are condensed rows
const feed = [
  {
    date: "Mar 2026",
    count: 3,
    categories: ["Comparisons", "Revenue", "Challenges"],
    featured: true,
    isNew: true,
  },
  {
    date: "Feb 2026",
    count: 4,
    categories: ["Ratings", "Analytics", "Reactions", "E-Commerce"],
    featured: false,
    isNew: false,
  },
  {
    date: "Jan 2026",
    count: 3,
    categories: ["Growth", "Alerts", "Subscribers"],
    featured: false,
    isNew: false,
  },
  {
    date: "Dec 2025",
    count: 4,
    categories: ["Social", "Challenges", "Revenue", "Timers"],
    featured: false,
    isNew: false,
  },
  {
    date: "Nov 2025",
    count: 3,
    categories: ["Analytics", "Comparisons", "E-Commerce"],
    featured: false,
    isNew: false,
  },
  {
    date: "Oct 2025",
    count: 4,
    categories: ["Subscribers", "Growth", "Ratings", "Reactions"],
    featured: false,
    isNew: false,
  },
]

export function LibraryGrowthV5() {
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
            {feed.map(({ date, count, categories, featured, isNew }, i) => (
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

                  {/* Card — featured vs compact */}
                  {featured ? (
                    <div className="flex-1 rounded-xl border border-accent/20 bg-accent/[0.03] p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight text-accent">
                              +{count}
                            </span>
                            <span className="text-xs font-medium text-accent/60">new assets</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {categories.map((cat) => (
                              <span
                                key={cat}
                                className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-medium text-accent"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-accent">
                          New
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-base-surface px-4 py-3">
                      <span className="text-sm font-semibold text-content-muted">+{count}</span>
                      <span className="text-xs text-content-muted/50">{categories.join(", ")}</span>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
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
