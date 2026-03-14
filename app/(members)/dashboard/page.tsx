import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { assetService } from "@/lib/services/index";
import { MemberAssetCard } from "@/components/members/member-asset-card";
import { DashboardGreeting } from "@/components/members/dashboard-greeting";
import { formatDate } from "@/lib/utils/format";
import type { Asset } from "@/types/asset";

export const metadata: Metadata = { title: "Dashboard" };

async function getFavoriteAssets(): Promise<{ assets: Asset[]; ids: Set<string> }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { assets: [], ids: new Set() };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { assets: [], ids: new Set() };
  const { data } = await supabase.from("favorites").select("asset_id").eq("user_id", user.id);
  const ids = new Set((data ?? []).map((r: { asset_id: string }) => r.asset_id));
  const all = await assetService.getLibrary();
  const assets = all.filter((a) => ids.has(a.id));
  return { assets, ids };
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  const sub = user ? await getSubscription() : null;
  const email = user?.email ?? (demoMode ? "demo@psdfuel.com" : "");

  // Favorites
  const { assets: favoriteAssets, ids: favoriteIds } = demoMode
    ? { assets: [] as Asset[], ids: new Set<string>() }
    : await getFavoriteAssets();

  // All published assets, newest first
  const allAssets = await assetService.getLibrary();
  const byNewest = [...allAssets].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Newest 4 assets
  const newAssets = byNewest.slice(0, 4);

  // Recommended: same categories as favorites, excluding already-favorited
  let recommendedAssets: Asset[] = [];
  if (favoriteAssets.length > 0) {
    const favCategories = new Set(favoriteAssets.map((a) => a.category));
    recommendedAssets = allAssets
      .filter((a) => favCategories.has(a.category) && !favoriteIds.has(a.id))
      .slice(0, 4);
  }
  // Fall back to featured if no recommendations
  if (recommendedAssets.length === 0) {
    recommendedAssets = allAssets.filter((a) => a.is_featured).slice(0, 4);
  }

  const hasFavorites = favoriteAssets.length > 0;
  const renewalDate = sub?.current_period_end ? formatDate(sub.current_period_end) : null;
  const renewalLabel = sub?.cancel_at_period_end ? "Access until" : "Next renewal";

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Greeting */}
        <DashboardGreeting email={email} renewalDate={renewalDate} renewalLabel={renewalLabel} />

        {/* Favorites */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-content-muted">
                Your favorites
              </h2>
              {hasFavorites && (
                <p className="mt-0.5 text-xs text-content-muted">
                  {favoriteAssets.length} saved asset{favoriteAssets.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {hasFavorites && (
              <Link
                href="/favorites"
                className="flex items-center gap-1 text-xs text-content-muted hover:text-content-primary transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {hasFavorites ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {favoriteAssets.slice(0, 4).map((asset) => (
                <MemberAssetCard key={asset.id} asset={asset} isFavorited={true} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-base-surface">
                <Heart className="h-4 w-4 text-content-muted" />
              </div>
              <p className="text-sm font-medium text-content-primary">No favorites yet</p>
              <p className="mt-1 text-xs text-content-muted">
                Save assets you like — they'll appear here.
              </p>
              <Link
                href="/library"
                className="mt-4 flex items-center gap-1 text-xs text-content-secondary hover:text-content-primary transition-colors"
              >
                Browse the library <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </section>

        {/* New in the library */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-content-muted">
              New in the library
            </h2>
            <Link
              href="/library"
              className="flex items-center gap-1 text-xs text-content-muted hover:text-content-primary transition-colors"
            >
              Browse all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {newAssets.map((asset) => (
              <MemberAssetCard
                key={asset.id}
                asset={asset}
                isFavorited={favoriteIds.has(asset.id)}
              />
            ))}
          </div>
        </section>

        {/* Recommended */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-content-muted">
              {hasFavorites ? "More like your favorites" : "Staff picks"}
            </h2>
            <Link
              href="/library"
              className="flex items-center gap-1 text-xs text-content-muted hover:text-content-primary transition-colors"
            >
              Full library <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {recommendedAssets.map((asset) => (
              <MemberAssetCard
                key={asset.id}
                asset={asset}
                isFavorited={favoriteIds.has(asset.id)}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
