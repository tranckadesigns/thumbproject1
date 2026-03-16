"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

const ALL_LABEL = "All";

interface LibrarySidebarProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  activeCategory?: string;
  onCategoryChange: (cat?: string) => void;
}

export function LibrarySidebar({
  categories,
  categoryCounts,
  totalCount,
  activeCategory,
  onCategoryChange,
}: LibrarySidebarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<{ top: number; height: number } | null>(null);

  const items = [
    { label: ALL_LABEL, count: totalCount },
    ...categories.map((cat) => ({ label: cat, count: categoryCounts[cat] ?? 0 })),
  ];

  useLayoutEffect(() => {
    const activeIndex = items.findIndex(({ label }) =>
      label === ALL_LABEL ? !activeCategory : activeCategory === label
    );
    const btn = buttonRefs.current[activeIndex];
    const nav = navRef.current;
    if (btn && nav) {
      const navRect = nav.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setPill({ top: btnRect.top - navRect.top, height: btnRect.height });
    }
  }, [activeCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <nav className="flex flex-col gap-0.5">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-content-muted">
        Categories
      </p>
      <div ref={navRef} className="relative">
        {pill && (
          <div
            className="absolute left-0 right-0 rounded-lg bg-accent/10"
            style={{
              top: pill.top,
              height: pill.height,
              transition: "top 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          />
        )}
        {items.map(({ label, count }, i) => {
          const isActive = label === ALL_LABEL ? !activeCategory : activeCategory === label;
          return (
            <button
              key={label}
              ref={(el) => { buttonRefs.current[i] = el; }}
              onClick={() => onCategoryChange(label === ALL_LABEL ? undefined : label)}
              className={cn(
                "relative group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "text-content-primary"
                  : "text-content-secondary hover:text-content-primary"
              )}
            >
              <span className={cn("font-medium", isActive && "text-accent")}>{label}</span>
              <span className={cn("text-xs tabular-nums", isActive ? "text-accent/70" : "text-content-muted")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
