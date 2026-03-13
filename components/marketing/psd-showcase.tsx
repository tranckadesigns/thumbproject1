"use client";

import { useEffect, useState } from "react";
import { Layers, Type, MousePointer2, Sliders } from "lucide-react";

// ─── Animation Phases ────────────────────────────────────────────────────────

// Phase 0: show $2,140 — low revenue state
// Phase 1: selection highlight on number
// Phase 2: typing new number
// Phase 3: show $24,180 — new state complete

const PHASE_DURATIONS = [1800, 600, 1200, 2200];

const VALUES = ["$2,140", "$24,180"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function LayerRow({
  label,
  type,
  active,
  indent = false,
}: {
  label: string;
  type: "group" | "text" | "shape" | "fx";
  active?: boolean;
  indent?: boolean;
}) {
  const icon =
    type === "group" ? "▸" : type === "text" ? "T" : type === "fx" ? "fx" : "□";
  return (
    <div
      className={`flex items-center gap-1.5 rounded px-2 py-1 transition-colors ${
        active
          ? "bg-[#C9A96E]/15 text-[#C9A96E]"
          : "text-white/40 hover:text-white/60"
      } ${indent ? "pl-5" : ""}`}
    >
      <span className="w-3 text-center font-mono text-[9px]">{icon}</span>
      <span className="text-[10px] font-medium truncate">{label}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function PsdShowcase() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPhase((p) => (p + 1) % 4);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(timeout);
  }, [phase]);

  const isSelecting = phase === 1;
  const isTyping = phase === 2;
  const isDone = phase === 3;
  const showNew = isTyping || isDone;
  const displayValue = showNew ? VALUES[1] : VALUES[0];

  return (
    <section className="border-t border-border-subtle px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left — copy */}
          <div>
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              Fully editable PSD
            </p>
            <h2 className="text-3xl font-semibold tracking-tighter text-content-primary md:text-4xl">
              Your numbers.
              <br />
              <span className="text-accent">Swap in seconds.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-content-secondary">
              Every asset ships as a fully layered Adobe Photoshop file. Change
              any number, color, or text in seconds — no design experience
              required.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                { icon: Layers, text: "Fully layered — every element on its own layer" },
                { icon: Type, text: "Editable text — swap numbers and labels instantly" },
                { icon: Sliders, text: "Smart objects — resize without losing quality" },
                { icon: MousePointer2, text: "Click, type, export — done in under 60 seconds" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-accent/10">
                    <Icon className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-sm text-content-secondary">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — animated PSD mockup */}
          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-border bg-[#1C1C1E] shadow-overlay">
              {/* Photoshop-style title bar */}
              <div className="flex items-center gap-2 border-b border-white/5 bg-[#2C2C2E] px-3 py-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </div>
                <span className="ml-2 text-[10px] text-white/30 font-medium">
                  revenue-overlay-v2.psd @ 100%
                </span>
              </div>

              <div className="flex">
                {/* Canvas area */}
                <div className="flex-1 bg-[#404040] p-4 min-h-[220px] flex items-center justify-center">
                  <div className="relative w-full max-w-[220px] rounded-lg bg-[#0f0f0f] border border-white/10 p-3 shadow-overlay">
                    {/* Header row */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="h-4 w-4 rounded-full bg-[#FF0000] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-white">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.84 4.84 0 0 1-1-.07z" />
                        </svg>
                      </div>
                      <span className="text-[9px] text-white/50 font-medium">YouTube Studio</span>
                    </div>

                    <p className="text-[9px] text-white/40 mb-1">Monthly revenue</p>

                    {/* Animated number */}
                    <div className="flex items-end justify-between">
                      <span
                        className={`text-lg font-bold tracking-tight transition-all duration-300 ${
                          isSelecting
                            ? "rounded bg-[#0066FF]/40 text-white px-0.5 outline outline-1 outline-[#0066FF]"
                            : isTyping
                            ? "text-white"
                            : "text-white"
                        }`}
                      >
                        {isTyping ? (
                          <span>
                            {displayValue}
                            <span className="animate-pulse">|</span>
                          </span>
                        ) : (
                          displayValue
                        )}
                      </span>
                      <span className="text-[9px] text-[#4ADE80] font-medium">
                        {showNew ? "+1,028%" : "+34%"}
                      </span>
                    </div>

                    {/* Mini bar */}
                    <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#FF0000] transition-all duration-700"
                        style={{ width: showNew ? "96%" : "38%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Layers panel */}
                <div className="w-[140px] border-l border-white/5 bg-[#232325] p-2 flex flex-col gap-0.5">
                  <p className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-wider text-white/30">
                    Layers
                  </p>
                  <LayerRow label="Overlay Group" type="group" />
                  <LayerRow label="Background" type="shape" indent />
                  <LayerRow label="Header Row" type="group" indent />
                  <LayerRow
                    label="Revenue Value"
                    type="text"
                    active={isSelecting || isTyping}
                    indent
                  />
                  <LayerRow label="Percent Badge" type="text" indent />
                  <LayerRow label="Progress Bar" type="shape" indent />
                  <LayerRow label="Drop Shadow" type="fx" indent />
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between border-t border-white/5 bg-[#2C2C2E] px-3 py-1.5">
                <span className="text-[9px] text-white/30">
                  {isSelecting
                    ? "Text tool — double-click to edit"
                    : isTyping
                    ? "Editing: Revenue Value"
                    : "Select: Move Tool"}
                </span>
                <span className="text-[9px] text-white/20">8 layers</span>
              </div>
            </div>

            {/* Glow accent */}
            <div className="pointer-events-none absolute -bottom-6 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
