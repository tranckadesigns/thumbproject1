import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils/cn"

const feed = [
  {
    date: "Mar 2026",
    count: 3,
    categories: ["Comparisons", "Revenue", "Challenges"],
    isNew: true,
  },
  {
    date: "Feb 2026",
    count: 4,
    categories: ["Ratings", "Analytics", "Reactions", "E-Commerce"],
    isNew: true,
  },
  {
    date: "Jan 2026",
    count: 3,
    categories: ["Growth", "Alerts", "Subscribers"],
    isNew: false,
  },
  {
    date: "Dec 2025",
    count: 4,
    categories: ["Social", "Challenges", "Revenue", "Timers"],
    isNew: false,
  },
  {
    date: "Nov 2025",
    count: 3,
    categories: ["Analytics", "Comparisons", "E-Commerce"],
    isNew: false,
  },
  {
    date: "Oct 2025",
    count: 4,
    categories: ["Subscribers", "Growth", "Ratings", "Reactions"],
    isNew: false,
  },
]

export function LibraryGrowthV1() {
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

        {/* Changelog feed */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-3">
            {feed.map(({ date, count, categories, isNew }, i) => (
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

                  {/* Dot on the line */}
                  <div className="relative z-10 mt-3.5 flex h-3 w-3 shrink-0 items-center justify-center">
                    <div className={cn(
                      "h-2.5 w-2.5 rounded-full border-2",
                      isNew
                        ? "border-accent bg-accent"
                        : "border-border bg-base"
                    )} />
                  </div>

                  {/* Entry card */}
                  <div className={cn(
                    "flex-1 rounded-xl border p-4 transition-colors duration-200",
                    isNew
                      ? "border-accent/20 bg-accent/[0.03]"
                      : "border-border bg-base-surface"
                  )}>
                    <div className="flex items-center justify-between gap-3">
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
                      {isNew && (
                        <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={400}>
          <p className="mt-8 text-center text-sm text-content-muted">
            Every new asset is included in all existing subscriptions — no extra cost, no action needed.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
