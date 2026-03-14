"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface LibrarySearchProps {
  activeSearch?: string;
  activeSort?: string;
  activeCategory?: string;
}

export function LibrarySearch({
  activeSearch,
  activeSort,
  activeCategory,
}: LibrarySearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(activeSearch ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input if activeSearch changes externally (e.g. sidebar category click clears search)
  useEffect(() => {
    setInputValue(activeSearch ?? "");
  }, [activeSearch]);

  const pushParams = useCallback(
    (q: string | undefined, sort?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (activeCategory) params.set("category", activeCategory);
      if (q) params.set("q", q);
      else params.delete("q");
      if (sort !== undefined) {
        if (sort && sort !== "newest") params.set("sort", sort);
        else params.delete("sort");
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams, activeCategory]
  );

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams(value || undefined);
    }, 350);
  };

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInputValue("");
    pushParams(undefined);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-content-muted" />
        <input
          type="search"
          placeholder="Search assets…"
          className="h-9 w-full rounded-lg border border-border bg-base-elevated pl-9 pr-8 text-sm text-content-primary placeholder:text-content-muted focus:border-border-strong focus:outline-none transition-colors"
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Sort */}
      <select
        value={activeSort ?? "newest"}
        onChange={(e) => pushParams(inputValue || undefined, e.target.value)}
        className="h-9 rounded-lg border border-border bg-base-elevated px-3 pr-8 text-sm text-content-secondary focus:border-border-strong focus:outline-none transition-colors appearance-none cursor-pointer"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
      >
        <option value="newest">Newest</option>
        <option value="featured">Featured</option>
        <option value="az">A – Z</option>
      </select>
    </div>
  );
}
