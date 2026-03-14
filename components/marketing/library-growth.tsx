import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils/cn"

const releases = [
  { month: "Sep '25", count: 3,  categories: ["Revenue", "Timers", "Alerts"] },
  { month: "Oct '25", count: 4,  categories: ["Subscribers", "Growth", "Ratings", "Reactions"] },
  { month: "Nov '25", count: 3,  categories: ["Analytics", "Comparisons", "E-Commerce"] },
  { month: "Dec '25", count: 4,  categories: ["Social", "Challenges", "Revenue", "Timers"] },
  { month: "Jan '26", count: 3,  categories: ["Growth", "Alerts", "Subscribers"] },
  { month: "Feb '26", count: 4,  categories: ["Ratings", "Analytics", "Reactions", "E-Commerce"] },
  { month: "Mar '26", count: 3,  categories: ["Comparisons", "Revenue", "Challenges"], current: true },
  { month: "Apr '26", count: 3,  categories: ["Timers", "Social", "Growth"], upcoming: true },
]

export function LibraryGrowthSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">

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
              You&apos;re not buying a static pack. Every asset added is yours
              automatically — no upgrades, no extra cost, forever.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {releases.map(({ month, count, categories, current, upcoming }) => (
              <div
                key={month}
                className={cn(
                  "relative flex flex-col rounded-xl border p-4",
                  upcoming  && "border-accent/25 bg-accent/[0.03]",
                  current   && "border-accent/40 bg-accent/[0.05]",
                  !current && !upcoming && "border-border bg-base-surface"
                )}
              >
                {/* Status badge */}
                {(current || upcoming) && (
                  <span className={cn(
                    "mb-2 self-start rounded-full px-2 py-px text-[8px] font-semibold uppercase tracking-wide",
                    current  ? "bg-accent/20 text-accent" : "bg-accent/10 text-accent/70"
                  )}>
                    {current ? "Now" : "Next"}
                  </span>
                )}

                <p className={cn(
                  "text-[10px] font-semibold",
                  current || upcoming ? "text-accent" : "text-content-muted"
                )}>
                  {month}
                </p>

                <p className={cn(
                  "mt-2 text-2xl font-bold tracking-tight",
                  current || upcoming ? "text-accent" : "text-content-primary"
                )}>
                  +{count}
                </p>
                <p className="mb-3 text-[10px] text-content-muted">assets</p>

                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <span key={cat} className={cn(
                      "truncate text-[9px] font-medium",
                      current || upcoming ? "text-accent/60" : "text-content-muted/50"
                    )}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-6 text-center text-sm text-content-muted">
            Every new asset is included in all existing subscriptions — no extra cost, no action needed.
          </p>
        </Reveal>

      </div>
    </section>
  )
}
