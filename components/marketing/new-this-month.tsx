import { Reveal } from "@/components/ui/reveal";
import {
  YouTubeRevenueOverlay,
  ChallengeProgressOverlay,
  CountdownTimerOverlay,
  BestWorstOverlay,
} from "@/components/marketing/asset-overlays";

const newAssets = [
  {
    name: "Emoji Reaction Bubbles",
    category: "Reactions",
    tag: "New",
    Preview: YouTubeRevenueOverlay,
  },
  {
    name: "Poll Vote Counter",
    category: "Reactions",
    tag: "New",
    Preview: ChallengeProgressOverlay,
  },
  {
    name: "Live Event Timer",
    category: "Timers",
    tag: "New",
    Preview: CountdownTimerOverlay,
  },
  {
    name: "Star Rating Badge",
    category: "Ratings",
    tag: "Updated",
    Preview: BestWorstOverlay,
  },
];

export function NewThisMonthSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <p className="text-xs font-medium uppercase tracking-widest text-content-muted">
                  March 2026
                </p>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent border border-accent/20">
                  Just added
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
                New this month.
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-content-secondary">
                The library grows every month. Every new asset is included
                automatically — no extra charge.
              </p>
            </div>
            <p className="shrink-0 text-sm text-content-muted">
              180+ total assets
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newAssets.map((asset, i) => (
            <Reveal key={asset.name} delay={i * 70}>
              <div className="group relative overflow-hidden rounded-xl border border-border bg-base-elevated transition-all duration-300 hover:border-border-strong hover:shadow-elevated">
                {/* Badge */}
                <div className="absolute right-3 top-3 z-10">
                  <span
                    className={
                      asset.tag === "New"
                        ? "rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent"
                        : "rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400"
                    }
                  >
                    {asset.tag}
                  </span>
                </div>

                {/* Preview area */}
                <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#181818]">
                  <div className="h-[70%] w-[55%]">
                    <asset.Preview />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-content-primary">
                    {asset.name}
                  </p>
                  <p className="mt-0.5 text-xs text-content-muted">
                    {asset.category}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <p className="mt-8 text-center text-sm text-content-muted">
            New assets are added every month and available instantly to all
            subscribers.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
