import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils/cn"

// One-time pack stays flat at 15 assets; Vaulted grows ~3-4/month
const months = [
  { label: "Sep", vaulted: 12, pack: 15 },
  { label: "Oct", vaulted: 16, pack: 15 },
  { label: "Nov", vaulted: 19, pack: 15 },
  { label: "Dec", vaulted: 23, pack: 15 },
  { label: "Jan", vaulted: 26, pack: 15 },
  { label: "Feb", vaulted: 30, pack: 15 },
  { label: "Mar", vaulted: 33, pack: 15 },
]

const MAX = 40 // chart ceiling

export function LibraryGrowthV2() {
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

        <Reveal delay={80}>
          {/* Legend */}
          <div className="mb-6 flex items-center justify-end gap-5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-8 rounded-full bg-border" />
              <span className="text-[11px] text-content-muted">One-time pack</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-8 rounded-full bg-accent" />
              <span className="text-[11px] text-content-muted">PSDfuel subscription</span>
            </div>
          </div>

          {/* Chart */}
          <div className="overflow-hidden rounded-2xl border border-border bg-base-surface p-6">
            <div className="flex items-end gap-3">
              {months.map(({ label, vaulted, pack }, i) => {
                const vaultedH = Math.round((vaulted / MAX) * 180)
                const packH = Math.round((pack / MAX) * 180)
                const isCurrent = i === months.length - 1

                return (
                  <div key={label} className="flex flex-1 flex-col items-center gap-2">
                    {/* Bars */}
                    <div className="relative flex w-full items-end justify-center gap-1" style={{ height: 180 }}>
                      {/* Pack bar (flat, dim) */}
                      <div
                        className="w-[38%] rounded-t-md bg-border/60 transition-all duration-500"
                        style={{ height: packH }}
                      />
                      {/* Vaulted bar */}
                      <div
                        className={cn(
                          "w-[38%] rounded-t-md transition-all duration-500",
                          isCurrent ? "bg-accent" : "bg-accent/50"
                        )}
                        style={{ height: vaultedH }}
                      >
                        {/* value label on top */}
                        <div className={cn(
                          "relative -top-5 text-center text-[10px] font-semibold",
                          isCurrent ? "text-accent" : "text-content-muted"
                        )}>
                          {vaulted}
                        </div>
                      </div>
                    </div>

                    {/* Month label */}
                    <p className={cn(
                      "text-[10px] font-medium",
                      isCurrent ? "text-accent" : "text-content-muted"
                    )}>
                      {label}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Baseline */}
            <div className="mt-2 border-t border-border/60" />

            {/* Delta callout */}
            <div className="mt-5 flex items-center justify-between rounded-xl border border-accent/15 bg-accent/[0.04] px-5 py-3">
              <div>
                <p className="text-xs text-content-muted">One-time pack after 7 months</p>
                <p className="text-sm font-semibold text-content-muted/60">15 assets — same as day one</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-content-muted">PSDfuel after 7 months</p>
                <p className="text-sm font-bold text-accent">33 assets — and growing</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-8 text-center text-sm text-content-muted">
            Every new asset is included in all existing subscriptions — no extra cost, no action needed.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
