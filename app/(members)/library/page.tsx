import type { Metadata } from "next";
import { Suspense } from "react";
import type { AssetCategory } from "@/types/asset";
import { assetService } from "@/lib/services/index";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LibrarySidebar } from "@/components/members/library-sidebar";
import { LibraryContent } from "@/components/members/library-content";
import { LibrarySkeleton } from "@/components/members/library-skeleton";
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

  // Fetch by category only — search is handled client-side
  let assets = await assetService.getLibrary({
    category: category as AssetCategory | undefined,
  });

  // Sort server-side so initial render is correct
  if (sort === "featured") {
    assets = [...assets].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
  } else if (sort === "az") {
    assets = [...assets].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "popular") {
    assets = [...assets].sort((a, b) => (b.download_count ?? 0) - (a.download_count ?? 0));
  } else {
    assets = [...assets].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  const allAssets = await assetService.getLibrary();

  const categoryCounts = allAssets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.category] = (acc[asset.category] ?? 0) + 1;
    return acc;
  }, {});

  const favoriteIds = await getFavoriteIds();
  const categories = [...siteConfig.categories] as string[];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">
          Library
        </h1>
        <p className="mt-1 text-sm text-content-muted">
          {category
            ? `${assets.length} asset${assets.length !== 1 ? "s" : ""} in ${category}`
            : `${allAssets.length} assets across ${siteConfig.categories.length} categories`}
        </p>
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

        {/* Search + asset grid — fully client-side search */}
        <div className="min-w-0 flex-1 space-y-6">
          <Suspense fallback={<LibrarySkeleton />}>
            <LibraryContent
              assets={assets}
              favoriteIds={favoriteIds}
              activeSort={sort}
              activeCategory={category}
              initialSearch={q}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
