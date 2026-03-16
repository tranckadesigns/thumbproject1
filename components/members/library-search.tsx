"use client";

import { Search, X } from "lucide-react";

interface LibrarySearchProps {
  value: string;
  onSearchChange: (v: string) => void;
  activeSort?: string;
  onSortChange: (v: string) => void;
}

export function LibrarySearch({ value, onSearchChange, activeSort, onSortChange }: LibrarySearchProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-content-muted" />
        <input
          type="text"
          placeholder="Search assets…"
          className="h-9 w-full rounded-lg border border-border bg-base-elevated pl-9 pr-8 text-sm text-content-primary placeholder:text-content-muted focus:border-border-strong focus:outline-none transition-colors"
          value={value}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {value && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <select
        value={activeSort ?? "newest"}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-9 rounded-lg border border-border bg-base-elevated px-3 pr-8 text-sm text-content-secondary focus:border-border-strong focus:outline-none transition-colors appearance-none cursor-pointer"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
      >
        <option value="newest">Newest</option>
        <option value="popular">Popular</option>
        <option value="featured">Featured</option>
        <option value="az">A – Z</option>
      </select>
    </div>
  );
}
