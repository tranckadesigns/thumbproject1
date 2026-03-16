"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils/cn";

const steps = [
  {
    id: 1,
    label: "Find your asset",
    desc: "Browse by category or search. Every asset previews at full fidelity before you download.",
    visual: "browse",
  },
  {
    id: 2,
    label: "Download the PSD",
    desc: "One click. The fully layered Photoshop file is yours instantly — no credits, no queue.",
    visual: "download",
  },
  {
    id: 3,
    label: "Edit in Photoshop",
    desc: "Click the text layer, type your number. Every element is on its own named layer.",
    visual: "edit",
  },
  {
    id: 4,
    label: "Export & publish",
    desc: "Save as PNG, drop it into your thumbnail canvas. Done in under 60 seconds.",
    visual: "export",
  },
];

// ─── Step 1: Browse ───────────────────────────────────────────────────────────
// Shows a mini library grid. One card is selected. Instantly recognizable.

function BrowseVisual() {
  const cards = [
    { label: "Revenue Alert", cat: "Revenue", selected: true },
    { label: "Subscriber Milestone", cat: "Subscribers", selected: false },
    { label: "Countdown Timer", cat: "Timers", selected: false },
    { label: "Poll Results", cat: "Reactions", selected: false },
    { label: "Growth Chart", cat: "Growth", selected: false },
    { label: "Before & After", cat: "Comparisons", selected: false },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-base-surface px-3 py-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-content-muted shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span className="text-xs text-content-muted">Revenue…</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className={cn(
              "flex flex-col gap-1.5 rounded-lg border p-2 transition-colors",
              card.selected
                ? "border-accent/40 bg-accent/[0.06]"
                : "border-border bg-base-elevated"
            )}
          >
            {/* Placeholder preview */}
            <div className={cn(
              "aspect-video w-full rounded-md",
              card.selected ? "bg-accent/10" : "bg-base-surface"
            )} />
            <p className={cn(
              "truncate text-[9px] font-medium leading-none",
              card.selected ? "text-accent" : "text-content-muted"
            )}>
              {card.label}
            </p>
          </div>
        ))}
      </div>
      <p className="text-center text-[10px] text-content-muted">Pick any asset from the library</p>
    </div>
  );
}

// ─── Step 2: Download ─────────────────────────────────────────────────────────
// Shows a PSD file + one big download button. Nothing else.

function DownloadVisual() {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* File */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-20 w-16 flex-col overflow-hidden rounded-lg border border-border bg-base-surface shadow-elevated">
          {/* Folded corner */}
          <div className="relative h-full w-full">
            <div className="absolute right-0 top-0 h-0 w-0 border-b-[12px] border-l-[12px] border-b-base-elevated border-l-transparent" />
            <div className="flex h-full flex-col items-center justify-center gap-1 pt-2">
              <div className="h-1 w-8 rounded-full bg-border-strong" />
              <div className="h-1 w-6 rounded-full bg-border" />
              <div className="h-1 w-7 rounded-full bg-border" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-accent/15 py-0.5 text-center text-[8px] font-bold tracking-widest text-accent">
              PSD
            </div>
          </div>
        </div>
        <p className="text-xs font-medium text-content-secondary">Revenue_Alert.psd</p>
        <p className="text-xs text-content-muted">18.4 MB</p>
      </div>

      {/* Button */}
      <button className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-black shadow-elevated transition-opacity hover:opacity-90">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download PSD
      </button>

      <p className="text-xs text-content-muted">Instant · No credits · No queue</p>
    </div>
  );
}

// ─── Step 3: Edit ─────────────────────────────────────────────────────────────
// Shows before → after. The number changes. Dead simple.

function EditVisual() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-xs font-medium uppercase tracking-widest text-content-muted">
        Double-click a text layer · Type your value
      </p>

      <div className="flex items-center gap-3">
        {/* Before */}
        <div className="flex-1 rounded-lg border border-border bg-base-elevated p-4 text-center">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-content-muted">Before</p>
          <p className="text-xl font-bold text-content-muted/30">$0.00</p>
        </div>

        {/* Arrow */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>

        {/* After */}
        <div className="flex-1 rounded-lg border border-accent/30 bg-accent/[0.06] p-4 text-center">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent/70">After</p>
          <p className="text-xl font-bold text-content-primary">$24,180</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-base-elevated px-4 py-3">
        <p className="mb-1 text-[9px] font-medium uppercase tracking-wide text-content-muted">Every element is a named layer</p>
        <div className="flex flex-wrap gap-1.5">
          {["Revenue amount", "Background card", "Accent bar", "Icon"].map((l, i) => (
            <span key={l} className={cn(
              "rounded-full border px-2 py-0.5 text-[9px] font-medium",
              i === 0
                ? "border-accent/25 bg-accent/10 text-accent"
                : "border-border text-content-muted"
            )}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Export ───────────────────────────────────────────────────────────
// Clear success state. File is done. Ready to use.

function ExportVisual() {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Success icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-emerald-500/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-content-primary">Ready to use</p>
        <p className="mt-1 text-sm text-content-muted">Exported as PNG · Drop into Photoshop</p>
      </div>

      {/* File chip */}
      <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10">
          <span className="text-[9px] font-bold text-emerald-400">PNG</span>
        </div>
        <div>
          <p className="text-xs font-medium text-content-primary">Revenue_Alert_final.png</p>
          <p className="text-[10px] text-content-muted">1920 × 1080 · Transparent bg</p>
        </div>
      </div>

      <p className="text-center text-[10px] text-content-muted">
        Total time: under 60 seconds
      </p>
    </div>
  );
}

const visuals: Record<string, React.ComponentType> = {
  browse: BrowseVisual,
  download: DownloadVisual,
  edit: EditVisual,
  export: ExportVisual,
};

export function DemoWorkflowSection() {
  const [active, setActive] = useState(0);
  const Visual = visuals[steps[active].visual];

  return (
    <section className="border-t border-border bg-base-surface px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-content-muted">
              See it in action
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              From library to thumbnail
              <br />
              in under 60 seconds.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Steps */}
            <div className="flex flex-col gap-2">
              {steps.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group flex items-start gap-4 rounded-xl border p-5 text-left transition-all duration-200",
                    active === i
                      ? "border-accent/25 bg-accent/[0.04]"
                      : "border-border bg-base-elevated hover:border-border-strong"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors",
                      active === i
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-border bg-base-surface text-content-muted"
                    )}
                  >
                    {step.id}
                  </div>
                  <div className="min-w-0">
                    <p className={cn(
                      "text-sm font-semibold",
                      active === i ? "text-content-primary" : "text-content-secondary"
                    )}>
                      {step.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-content-muted">
                      {step.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Visual panel */}
            <div className="flex items-center">
              <div className="w-full rounded-2xl border border-border bg-base-elevated p-7">
                <Visual />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
