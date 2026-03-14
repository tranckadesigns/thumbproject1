"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils/cn";
import { YouTubeRevenueOverlay } from "@/components/marketing/asset-overlays";

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

function BrowseVisual() {
  return (
    <div className="flex flex-col gap-2">
      {["Revenue", "Subscribers", "Timers", "Reactions"].map((cat, i) => (
        <div
          key={cat}
          className={cn(
            "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
            i === 0
              ? "border-accent/30 bg-accent/[0.06]"
              : "border-border bg-base-elevated"
          )}
        >
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              i === 0 ? "bg-accent" : "bg-border-strong"
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              i === 0 ? "text-content-primary" : "text-content-muted"
            )}
          >
            {cat}
          </span>
          <span className="ml-auto text-[10px] text-content-muted">
            {[4, 4, 3, 4][i]} assets
          </span>
        </div>
      ))}
    </div>
  );
}

function DownloadVisual() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#181818]">
        <div className="flex aspect-video items-center justify-center p-4">
          <div className="h-[70%] w-[55%]">
            <YouTubeRevenueOverlay />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center gap-3 rounded-lg border border-accent/25 bg-accent/[0.06] px-4 py-3">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="text-xs font-medium text-content-primary">
          Revenue_Alert_v2.psd
        </span>
        <span className="ml-auto text-[10px] text-content-muted">4.2 MB</span>
      </div>
    </div>
  );
}

function EditVisual() {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-lg border border-border bg-base-elevated px-3 py-2">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-content-muted">
          Layers
        </p>
        {[
          { name: "💰 Revenue amount", active: true },
          { name: "📋 Background card", active: false },
          { name: "🎨 Accent bar", active: false },
          { name: "✦ Icon", active: false },
        ].map((layer) => (
          <div
            key={layer.name}
            className={cn(
              "flex items-center gap-2 rounded px-2 py-1.5",
              layer.active ? "bg-accent/10" : ""
            )}
          >
            <div
              className={cn(
                "h-1 w-1 rounded-full",
                layer.active ? "bg-accent" : "bg-border-strong"
              )}
            />
            <span
              className={cn(
                "text-[11px]",
                layer.active ? "text-accent" : "text-content-muted"
              )}
            >
              {layer.name}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/[0.04] px-3 py-2.5">
        <span className="text-xs text-content-muted">Text:</span>
        <span className="font-mono text-sm font-semibold text-content-primary">
          $24,180
        </span>
        <span className="ml-auto text-[10px] text-accent">Active layer</span>
      </div>
    </div>
  );
}

function ExportVisual() {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#0d0d0d] to-[#181818]">
        <div className="flex aspect-video items-center justify-center">
          <div className="h-[75%] w-[58%]">
            <YouTubeRevenueOverlay />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5">
          <span className="text-[10px] font-semibold text-emerald-400">
            PNG exported
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-content-muted">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Ready to drop into your thumbnail canvas
      </div>
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
    <section className="border-t border-border px-6 py-24">
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
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        active === i
                          ? "text-content-primary"
                          : "text-content-secondary"
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-content-muted">
                      {step.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Visual */}
            <div className="flex items-center">
              <div className="w-full rounded-2xl border border-border bg-base-elevated p-6">
                <Visual />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
