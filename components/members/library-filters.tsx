"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/lib/config/site";

const ALL_LABEL = "All";

interface LibraryFiltersProps {
  activeCategory?: string;
  activeSearch?: string;
}

export function LibraryFilters({ activeCategory, activeSearch }: LibraryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParams = useCallback(
    (category?: string, search?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (category && category !== ALL_LABEL) {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  function handleCategoryClick(cat: string) {
    updateParams(cat === ALL_LABEL ? undefined : cat, activeSearch);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    updateParams(activeCategory, e.target.value || undefined);
  }

  function clearSearch() {
    updateParams(activeCategory, undefined);
  }

  const categories = [ALL_LABEL, ...siteConfig.categories];

  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
        <Input
          type="search"
          placeholder="Search assets…"
          className="pl-9 pr-8"
          value={activeSearch ?? ""}
          onChange={handleSearch}
        />
        {activeSearch && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive =
            cat === ALL_LABEL ? !activeCategory : activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "border border-border bg-base-elevated text-content-muted hover:border-border-strong hover:text-content-secondary"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
