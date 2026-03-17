"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatProps {
  raw: string;
  label: string;
}

function AnimatedStat({ raw, label }: AnimatedStatProps) {
  const [displayed, setDisplayed] = useState("—");
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const prefix = raw.startsWith("~") ? "~" : "";
        const numStr = raw.replace(/^~/, "").replace(/[^0-9,]/g, "").replace(/,/g, "");
        const suffix = raw.replace(/^~?[\d,]+/, "");
        const target = parseInt(numStr, 10);

        if (isNaN(target)) { setDisplayed(raw); return; }

        const duration = 1400;
        const startTime = performance.now();

        function tick(now: number) {
          const t = Math.min((now - startTime) / duration, 1);
          // ease-out-expo: snappy acceleration that slams into the final value
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          const current = Math.min(Math.round(eased * target), target);
          const formatted = current >= 1000 ? current.toLocaleString("en-US") : String(current);
          setDisplayed(prefix + formatted + suffix);
          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [raw]);

  return (
    <div ref={ref} className="flex flex-col items-center px-6 py-8 text-center">
      <span className="text-2xl font-semibold tracking-tightest text-content-primary tabular-nums">
        {displayed}
      </span>
      <span className="mt-1 text-xs text-content-muted">{label}</span>
    </div>
  );
}

interface StatsStripProps {
  assetCount: number;
  categoryCount: number;
  creatorCount: number;
}

export function StatsStrip({ assetCount, categoryCount, creatorCount }: StatsStripProps) {
  const stats = [
    { raw: `${assetCount}+`,                      label: "PSD assets" },
    { raw: String(categoryCount),                  label: "Categories" },
    { raw: `${creatorCount}+`,                     label: "Creators" },
    { raw: "~60s",                                 label: "Avg. edit time" },
  ];

  return (
    <div className="border-y border-border bg-base-surface">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
          {stats.map((s) => (
            <AnimatedStat key={s.label} raw={s.raw} label={s.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
