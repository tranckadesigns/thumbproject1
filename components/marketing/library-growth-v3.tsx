import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils/cn"

const drops = [
  {
    month: "Mar 2026",
    isNew: true,
    assets: [
      { name: "Revenue Split Card",   category: "Revenue" },
      { name: "Channel Comparison",   category: "Comparisons" },
      { name: "30-Day Challenge Bar", category: "Challenges" },
    ],
  },
  {
    month: "Feb 2026",
    isNew: true,
    assets: [
      { name: "Star Rating Popup",    category: "Ratings" },
      { name: "Watch Time Graph",     category: "Analytics" },
      { name: "Heart Reaction Cloud", category: "Reactions" },
      { name: "Cart Drop Overlay",    category: "E-Commerce" },
    ],
  },
  {
    month: "Jan 2026",
    isNew: false,
    assets: [
      { name: "Subscriber Wave",      category: "Subscribers" },
      { name: "Views Growth Arrow",   category: "Growth" },
      { name: "Live Alert Banner",    category: "Alerts" },
    ],
  },
]

export function LibraryGrowthV3() {
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

        <div className="space-y-6">
          {drops.map(({ month, isNew, assets }, di) => (
            <Reveal key={month} delay={di * 80}>
              <div>
                {/* Month header */}
                <div className="mb-3 flex items-center gap-3">
                  <p className={cn(
                    "text-xs font-semibold",
                    isNew ? "text-accent" : "text-content-muted"
                  )}>
                    {month}
                  </p>
                  {isNew && (
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                      New
                    </span>
                  )}
                  <div className="flex-1 border-t border-border" />
                  <span className="text-[10px] text-content-muted">{assets.length} assets</span>
                </div>

                {/* Asset grid */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {assets.map(({ name, category }, ai) => (
                    <Reveal key={name} delay={di * 80 + ai * 40}>
                      <div className={cn(
                        "flex flex-col gap-2 rounded-xl border p-4 transition-colors duration-200",
                        isNew
                          ? "border-accent/20 bg-accent/[0.03] hover:border-accent/30"
                          : "border-border bg-base-surface hover:border-border-strong"
                      )}>
                        {/* Icon placeholder — small abstract square */}
                        <div className={cn(
                          "h-8 w-8 rounded-lg border",
                          isNew ? "border-accent/20 bg-accent/10" : "border-border bg-base-elevated"
                        )}>
                          <div className={cn(
                            "m-1.5 h-5 w-5 rounded-md",
                            isNew ? "bg-accent/20" : "bg-border"
                          )} />
                        </div>

                        <div>
                          <p className={cn(
                            "text-[11px] font-semibold leading-tight",
                            isNew ? "text-content-primary" : "text-content-secondary"
                          )}>
                            {name}
                          </p>
                          <p className={cn(
                            "mt-0.5 text-[10px]",
                            isNew ? "text-accent/60" : "text-content-muted/60"
                          )}>
                            {category}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
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
