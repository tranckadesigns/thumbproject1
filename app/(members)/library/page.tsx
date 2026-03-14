import type { Metadata } from "next";
import { Suspense } from "react";
import type { AssetCategory } from "@/types/asset";
import { assetService } from "@/lib/services/index";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LibrarySidebar } from "@/components/members/library-sidebar";
import { LibrarySearch } from "@/components/members/library-search";
import { MemberAssetCard } from "@/components/members/member-asset-card";
import { MobileCategoryPillsClient } from "@/components/members/mobile-category-pills";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "Library" };

interface LibraryPageProps {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}

async function getFavoriteIds(): Promise<Set<string>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return new Set();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase.from("favorites").select("asset_id").eq("user_id", user.id);
  return new Set((data ?? []).map((r: { asset_id: string }) => r.asset_id));
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { category, q, sort } = await searchParams;

  let assets = await assetService.getLibrary({
    category: category as AssetCategory | undefined,
    search: q,
  });

  // Sort
  if (sort === "featured") {
    assets = [...assets].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
  } else if (sort === "az") {
    assets = [...assets].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Default: newest first
    assets = [...assets].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  const allAssets = await assetService.getLibrary();

  // Category counts from full library
  const categoryCounts = allAssets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.category] = (acc[asset.category] ?? 0) + 1;
    return acc;
  }, {});

  const [favoriteIds] = await Promise.all([getFavoriteIds()]);
  const categories = [...siteConfig.categories] as string[];
  const isFiltered = !!(category || q);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">
          Library
        </h1>
        <p className="mt-1 text-sm text-content-muted">
          {isFiltered
            ? `${assets.length} result${assets.length !== 1 ? "s" : ""}${category ? ` in ${category}` : ""}${q ? ` for "${q}"` : ""}`
            : `${allAssets.length} assets across ${siteConfig.categories.length} categories`}
        </p>
      </div>

      {/* Search + sort bar — full width */}
      <div className="mb-6">
        <Suspense>
          <LibrarySearch
            activeSearch={q}
            activeSort={sort}
            activeCategory={category}
          />
        </Suspense>
      </div>

      {/* Mobile category pills */}
      <div className="mb-6 lg:hidden">
        <Suspense>
          <MobileCategoryPillsClient
            categories={categories}
            activeCategory={category}
            categoryCounts={categoryCounts}
            totalCount={allAssets.length}
          />
        </Suspense>
      </div>

      {/* Sidebar + grid */}
      <div className="flex gap-10">
        {/* Sidebar — desktop only */}
        <aside className="hidden w-44 shrink-0 lg:block">
          <div className="sticky top-24">
            <Suspense>
              <LibrarySidebar
                categories={categories}
                categoryCounts={categoryCounts}
                totalCount={allAssets.length}
                activeCategory={category}
              />
            </Suspense>
          </div>
        </aside>

        {/* Asset grid */}
        <div className="min-w-0 flex-1">
          {assets.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <MemberAssetCard key={asset.id} asset={asset} isFavorited={favoriteIds.has(asset.id)} />
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
    </div>
  );
}
