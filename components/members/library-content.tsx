"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LibrarySearch } from "@/components/members/library-search";
import { MemberAssetCard } from "@/components/members/member-asset-card";
import type { Asset } from "@/types/asset";

interface LibraryContentProps {
  assets: Asset[];
  favoriteIds: Set<string>;
  activeSort?: string;
  activeCategory?: string;
  initialSearch?: string;
}

export function LibraryContent({
  assets,
  favoriteIds,
  activeSort,
  activeCategory,
  initialSearch,
}: LibraryContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("q") ?? initialSearch ?? ""
  );

  function handleSearchChange(value: string) {
    setSearchValue(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.short_description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [assets, searchValue]);

  return (
    <>
      <LibrarySearch
        value={searchValue}
        onSearchChange={handleSearchChange}
        activeSort={activeSort}
        activeCategory={activeCategory}
        resultCount={filtered.length}
        totalCount={assets.length}
      />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <MemberAssetCard
              key={asset.id}
              asset={asset}
              isFavorited={favoriteIds.has(asset.id)}
            />
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
    </>
  );
}
