import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { assetService } from "@/lib/services/index";
import { MemberAssetCard } from "@/components/members/member-asset-card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Favorites" };

interface FavoritesPageProps {
  searchParams: Promise<{ sort?: string }>;
}

const SORT_OPTIONS = [
  { value: "saved",   label: "Date saved" },
  { value: "az",      label: "A – Z" },
  { value: "popular", label: "Popular" },
];

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const { sort } = await searchParams;
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  let favoriteIds = new Set<string>();
  if (supabase && user) {
    const { data } = await supabase
      .from("favorites")
      .select("asset_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    favoriteIds = new Set((data ?? []).map((r: { asset_id: string }) => r.asset_id));
  }

  const allAssets = await assetService.getLibrary();
  let favoriteAssets = [...favoriteIds]
    .map((id) => allAssets.find((a) => a.id === id))
    .filter(Boolean) as typeof allAssets;

  if (sort === "az") {
    favoriteAssets = [...favoriteAssets].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "popular") {
    favoriteAssets = [...favoriteAssets].sort((a, b) => (b.download_count ?? 0) - (a.download_count ?? 0));
  }
  // default: "saved" = already in date-saved order from favoriteIds set

  const activeSort = sort ?? "saved";

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-content-primary">Favorites</h1>
            <p className="mt-1 text-sm text-content-muted">
              {favoriteAssets.length > 0
                ? `${favoriteAssets.length} saved asset${favoriteAssets.length !== 1 ? "s" : ""}`
                : "Assets you save will appear here"}
            </p>
          </div>
          {favoriteAssets.length > 1 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-base-elevated p-1">
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={opt.value === "saved" ? "/favorites" : `/favorites?sort=${opt.value}`}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeSort === opt.value
                      ? "bg-base-surface text-content-primary"
                      : "text-content-muted hover:text-content-primary"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {favoriteAssets.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {favoriteAssets.map((asset) => (
              <MemberAssetCard key={asset.id} asset={asset} isFavorited={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-base-elevated">
              <Heart className="h-5 w-5 text-content-muted" />
            </div>
            <p className="text-sm font-medium text-content-primary">No favorites yet</p>
            <p className="mt-1.5 text-sm text-content-muted">
              Click the heart on any asset to save it here.
            </p>
            <Link
              href="/library"
              className="mt-6 text-sm text-content-secondary hover:text-content-primary transition-colors"
            >
              Browse the library →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
