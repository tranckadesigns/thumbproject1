"use client";

import { useState, useMemo } from "react";
import type { Asset } from "@/types/asset";
import { LibrarySidebar } from "@/components/members/library-sidebar";
import { MobileCategoryPillsClient } from "@/components/members/mobile-category-pills";
import { LibrarySearch } from "@/components/members/library-search";
import { MemberAssetCard } from "@/components/members/member-asset-card";

interface LibraryShellProps {
  allAssets: Asset[];
  favoriteIds: string[];
  categories: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  initialCategory?: string;
  initialSort?: string;
  initialSearch?: string;
  initialNiche?: string;
}

export function LibraryShell({
  allAssets,
  favoriteIds,
  categories,
  categoryCounts,
  totalCount,
  initialCategory,
  initialSort,
  initialSearch,
  initialNiche,
}: LibraryShellProps) {
  const favSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const [category, setCategory] = useState(initialCategory);
  const [niche, setNiche] = useState<string | undefined>(initialNiche);
  const [sort, setSort] = useState(initialSort ?? "newest");
  const [search, setSearch] = useState(initialSearch ?? "");

  function syncURL(cat?: string, s?: string, q?: string, n?: string) {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (s && s !== "newest") params.set("sort", s);
    if (q) params.set("q", q);
    if (n) params.set("niche", n);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  function handleCategoryChange(cat?: string) {
    setCategory(cat);
    syncURL(cat, sort, search, niche);
  }

  function handleSortChange(s: string) {
    setSort(s);
    syncURL(category, s, search, niche);
  }

  function handleSearchChange(q: string) {
    setSearch(q);
    syncURL(category, sort, q, niche);
  }

  // All niches across ALL assets, sorted by how many assets they have.
  // Count shown per niche reflects the current primary-category filter
  // so the user sees how many results they'd get.
  const allNiches = useMemo(() => {
    const globalCounts: Record<string, number> = {};
    const filteredCounts: Record<string, number> = {};
    const categoryFiltered = category
      ? allAssets.filter((a) => a.category === category)
      : allAssets;

    for (const asset of allAssets) {
      for (const n of asset.niche_categories ?? []) {
        globalCounts[n] = (globalCounts[n] ?? 0) + 1;
      }
    }
    for (const asset of categoryFiltered) {
      for (const n of asset.niche_categories ?? []) {
        filteredCounts[n] = (filteredCounts[n] ?? 0) + 1;
      }
    }

    return Object.keys(globalCounts)
      .sort((a, b) => globalCounts[b] - globalCounts[a])
      .map((name) => ({ name, count: filteredCounts[name] ?? 0 }));
  }, [allAssets, category]);

  const filtered = useMemo(() => {
    let result = category ? allAssets.filter((a) => a.category === category) : allAssets;
    if (niche) result = result.filter((a) => a.niche_categories?.includes(niche));

    if (sort === "featured") {
      result = [...result].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    } else if (sort === "az") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "popular") {
      result = [...result].sort((a, b) => (b.download_count ?? 0) - (a.download_count ?? 0));
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.short_description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allAssets, category, niche, sort, search]);

  return (
    <>
      {/* Mobile category pills */}
      <div className="mb-6 lg:hidden">
        <MobileCategoryPillsClient
          categories={categories}
          categoryCounts={categoryCounts}
          totalCount={totalCount}
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Sidebar + grid */}
      <div className="flex gap-10">
        <aside className="hidden w-44 shrink-0 lg:block">
          <div className="sticky top-24">
            <LibrarySidebar
              categories={categories}
              categoryCounts={categoryCounts}
              totalCount={totalCount}
              activeCategory={category}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <LibrarySearch
            value={search}
            onSearchChange={handleSearchChange}
            activeSort={sort}
            onSortChange={handleSortChange}
          />

          {/* Niche filters — always visible when niches exist, independent of primary category.
              Counts update to reflect the current primary-category filter. */}
          {allNiches.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {niche && (
                <button
                  onClick={() => { setNiche(undefined); syncURL(category, sort, search, undefined); }}
                  className="flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
                >
                  {niche}
                  <span className="opacity-60">×</span>
                </button>
              )}
              {allNiches
                .filter((n) => n.name !== niche)
                .map(({ name, count }) => (
                  <button
                    key={name}
                    onClick={() => { setNiche(name); syncURL(category, sort, search, name); }}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      count === 0
                        ? "cursor-default border-border/40 text-content-subtle opacity-40"
                        : "border-border text-content-muted hover:border-content-muted hover:text-content-primary"
                    }`}
                    disabled={count === 0}
                  >
                    {name}
                    {count > 0 && (
                      <span className="ml-1.5 tabular-nums opacity-50">{count}</span>
                    )}
                  </button>
                ))}
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((asset, i) => (
                <div
                  key={asset.id}
                  style={{
                    animation: "slideUp 0.4s ease both",
                    animationDelay: `${Math.min(i * 40, 400)}ms`,
                  }}
                >
                  <MemberAssetCard asset={asset} isFavorited={favSet.has(asset.id)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-base-elevated">
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M7 0 L8.3 5.7 L14 7 L8.3 8.3 L7 14 L5.7 8.3 L0 7 L5.7 5.7 Z"
                    fill="rgba(201,169,110,0.3)"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-content-primary">No assets found</p>
              <p className="mt-1.5 text-sm text-content-muted">
                Try a different search or category.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
