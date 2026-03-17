import type { Metadata } from "next";
import { assetService } from "@/lib/services/index";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LibraryShell } from "@/components/members/library-shell";
import { siteConfig } from "@/lib/config/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Library" };

interface LibraryPageProps {
  searchParams: Promise<{ category?: string; q?: string; sort?: string; niche?: string }>;
}

async function getFavoriteIds(): Promise<string[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("favorites").select("asset_id").eq("user_id", user.id);
  return (data ?? []).map((r: { asset_id: string }) => r.asset_id);
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { category, q, sort, niche } = await searchParams;

  const [allAssets, favoriteIds] = await Promise.all([
    assetService.getLibrary(),
    getFavoriteIds(),
  ]);

  const categoryCounts = allAssets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.category] = (acc[asset.category] ?? 0) + 1;
    return acc;
  }, {});

  const categories = [...siteConfig.categories] as string[];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">Your library</h1>
        <p className="mt-1 text-sm text-content-muted">
          {allAssets.length} assets across {siteConfig.categories.length} categories — yours to download.
        </p>
      </div>

      <LibraryShell
        allAssets={allAssets}
        favoriteIds={favoriteIds}
        categories={categories}
        categoryCounts={categoryCounts}
        totalCount={allAssets.length}
        initialCategory={category}
        initialSort={sort}
        initialSearch={q}
        initialNiche={niche}
      />
    </div>
  );
}
