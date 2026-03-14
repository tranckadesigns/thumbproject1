import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils/cn";

const alternatives = [
  {
    label: "Fiverr designer",
    price: "$45",
    unit: "per thumbnail",
    note: "1–3 days turnaround",
    dim: true,
  },
  {
    label: "Envato / Creative Market",
    price: "$29",
    unit: "per template pack",
    note: "Static files, no updates",
    dim: true,
  },
  {
    label: "In-house design time",
    price: "$35+",
    unit: "per hour",
    note: "~2 hrs per thumbnail",
    dim: true,
  },
  {
    label: "PSDfuel",
    price: "$19",
    unit: "per month",
    note: "180+ assets, unlimited downloads",
    dim: false,
    highlight: true,
  },
];

export function PriceAnchorSection() {
  return (
    <section className="border-t border-border bg-base-surface px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-content-muted">
              The math
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              One designer. One month.
              <br />
              Or one subscription forever.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-secondary">
              Most creators are already paying more for worse results. PSDfuel
              replaces the cost and the wait.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {alternatives.map((alt, i) => (
            <Reveal key={alt.label} delay={i * 70}>
              <div
                className={cn(
                  "relative flex flex-col gap-3 rounded-xl border p-6 transition-all duration-300",
                  alt.highlight
                    ? "border-accent/30 bg-accent/[0.04] shadow-elevated"
                    : "border-border bg-base-elevated"
                )}
              >
                {alt.highlight && (
                  <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                )}
                <p
                  className={cn(
                    "text-xs font-medium",
                    alt.dim ? "text-content-muted" : "text-accent"
                  )}
                >
                  {alt.label}
                </p>
                <div>
                  <span
                    className={cn(
                      "text-3xl font-bold tracking-tight",
                      alt.dim ? "text-content-secondary" : "text-content-primary"
                    )}
                  >
                    {alt.price}
                  </span>
                  <span className="ml-1 text-xs text-content-muted">
                    {alt.unit}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-content-muted">
                  {alt.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "active:scale-[0.97] transition-transform"
              )}
            >
              Start for $19/mo
            </Link>
            <p className="text-xs text-content-muted">
              30-day money-back guarantee · Cancel anytime
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
