import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { assetService } from "@/lib/services/index";
import { MemberAssetCard } from "@/components/members/member-asset-card";
import { DashboardGreeting } from "@/components/members/dashboard-greeting";
import { RecentlyViewed } from "@/components/members/recently-viewed";
import { WelcomeCard } from "@/components/members/welcome-card";
import { OnboardingBanner } from "@/components/members/onboarding-banner";
import { formatDate } from "@/lib/utils/format";
import { Suspense } from "react";
import type { Asset } from "@/types/asset";

export const dynamic = "force-dynamic";
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
  const sub = user ? await getSubscription() : null;
  const email = user?.email ?? "";
  const displayName = (user?.user_metadata?.display_name as string | undefined) ?? undefined;

  // Favorites
  const { assets: favoriteAssets, ids: favoriteIds } = await getFavoriteAssets();

  // All published assets, newest first
  const allAssets = await assetService.getLibrary();
  const byNewest = [...allAssets].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Newest 4 assets
  const newAssets = byNewest.slice(0, 4);

  // Staff picks: start with featured assets, then fill with category matches
  // when the user has favorites (so content stays relevant without renaming the section).
  const featuredAssets = allAssets.filter((a) => a.is_featured);
  let staffPicks: Asset[] = [];

  if (favoriteAssets.length > 0) {
    const favCategories = new Set(favoriteAssets.map((a) => a.category));
    const related = allAssets.filter(
      (a) => favCategories.has(a.category) && !favoriteIds.has(a.id)
    );
    // Fill up to 4: related first, then featured as fallback
    const seen = new Set<string>();
    for (const a of [...related, ...featuredAssets]) {
      if (!seen.has(a.id) && !favoriteIds.has(a.id)) {
        seen.add(a.id);
        staffPicks.push(a);
      }
      if (staffPicks.length === 4) break;
    }
  } else {
    staffPicks = featuredAssets.slice(0, 4);
  }

  const hasFavorites = favoriteAssets.length > 0;

  // Relative renewal copy — e.g. "Renews in 18 days" instead of a bare date
  function getRelativeRenewal(iso: string | null, cancelAtEnd: boolean): { label: string; value: string | null } {
    if (!iso) return { label: "Next renewal", value: null };
    const diffDays = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
    if (cancelAtEnd) {
      if (diffDays <= 0) return { label: "Access expired", value: formatDate(iso) };
      if (diffDays <= 60) return { label: "Expires in", value: `${diffDays} day${diffDays !== 1 ? "s" : ""}` };
      return { label: "Access until", value: formatDate(iso) };
    }
    if (diffDays <= 0) return { label: "Renews", value: "today" };
    if (diffDays === 1) return { label: "Renews", value: "tomorrow" };
    if (diffDays <= 60) return { label: "Renews in", value: `${diffDays} days` };
    return { label: "Next renewal", value: formatDate(iso) };
  }

  const { label: renewalLabel, value: renewalDate } = getRelativeRenewal(
    sub?.current_period_end ?? null,
    sub?.cancel_at_period_end ?? false
  );

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* Post-checkout welcome banner */}
        <Suspense>
          <OnboardingBanner />
        </Suspense>

        {/* Greeting */}
        <DashboardGreeting email={email} displayName={displayName} renewalDate={renewalDate} renewalLabel={renewalLabel} />

        {/* First-session welcome card — shown once when member has no activity */}
        {!hasFavorites && <WelcomeCard />}

        {/* Recently viewed — reads localStorage, renders nothing if empty */}
        <RecentlyViewed favoriteIds={[...favoriteIds]} />

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
                Save assets you like — they&apos;ll appear here.
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

        {/* Staff picks */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-content-muted">
              Staff picks
            </h2>
            <Link
              href="/library"
              className="flex items-center gap-1 text-xs text-content-muted hover:text-content-primary transition-colors"
            >
              Full library <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {staffPicks.map((asset) => (
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
