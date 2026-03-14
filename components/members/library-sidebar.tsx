"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils/cn";

const ALL_LABEL = "All";

interface LibrarySidebarProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  activeCategory?: string;
}

export function LibrarySidebar({
  categories,
  categoryCounts,
  totalCount,
  activeCategory,
}: LibrarySidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function navigate(category?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const items = [
    { label: ALL_LABEL, count: totalCount },
    ...categories.map((cat) => ({ label: cat, count: categoryCounts[cat] ?? 0 })),
  ];

  return (
    <nav className="flex flex-col gap-0.5">
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-content-muted">
        Categories
      </p>
      {items.map(({ label, count }) => {
        const isActive =
          label === ALL_LABEL ? !activeCategory : activeCategory === label;
        return (
          <button
            key={label}
            onClick={() => navigate(label === ALL_LABEL ? undefined : label)}
            className={cn(
              "group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent/10 text-content-primary"
                : "text-content-secondary hover:bg-base-surface hover:text-content-primary"
            )}
          >
            <span className={cn("font-medium", isActive && "text-accent")}>
              {label}
            </span>
            <span
              className={cn(
                "text-xs tabular-nums",
                isActive ? "text-accent/70" : "text-content-muted"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
