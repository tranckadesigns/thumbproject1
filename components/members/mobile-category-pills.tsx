"use client";

import { cn } from "@/lib/utils/cn";

interface MobileCategoryPillsClientProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  activeCategory?: string;
  onCategoryChange: (cat?: string) => void;
}

export function MobileCategoryPillsClient({
  categories,
  categoryCounts,
  totalCount,
  activeCategory,
  onCategoryChange,
}: MobileCategoryPillsClientProps) {
  const items = [
    { label: "All", count: totalCount },
    ...categories.map((cat) => ({ label: cat, count: categoryCounts[cat] ?? 0 })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {items.map(({ label, count }) => {
        const isActive = label === "All" ? !activeCategory : activeCategory === label;
        return (
          <button
            key={label}
            onClick={() => onCategoryChange(label === "All" ? undefined : label)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              isActive
                ? "border border-accent/25 bg-accent/10 text-accent"
                : "border border-border bg-base-elevated text-content-muted hover:border-border-strong hover:text-content-secondary"
            )}
          >
            {label}
            <span className="ml-1.5 opacity-60">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
