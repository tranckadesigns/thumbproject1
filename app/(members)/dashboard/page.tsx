import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LayoutGrid, Sparkles, FolderOpen } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { assetService } from "@/lib/services/index";
import { MemberAssetCard } from "@/components/members/member-asset-card";
import { siteConfig } from "@/lib/config/site";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Dashboard" };

const categoryColors: Record<string, string> = {
  Revenue:      "text-amber-400 border-amber-400/20 hover:border-amber-400/40",
  Subscribers:  "text-red-400 border-red-400/20 hover:border-red-400/40",
  Growth:       "text-emerald-400 border-emerald-400/20 hover:border-emerald-400/40",
  Alerts:       "text-yellow-400 border-yellow-400/20 hover:border-yellow-400/40",
  Social:       "text-purple-400 border-purple-400/20 hover:border-purple-400/40",
  "E-Commerce": "text-lime-400 border-lime-400/20 hover:border-lime-400/40",
  Analytics:    "text-sky-400 border-sky-400/20 hover:border-sky-400/40",
  Challenges:   "text-orange-400 border-orange-400/20 hover:border-orange-400/40",
  Comparisons:  "text-slate-400 border-slate-400/20 hover:border-slate-400/40",
  Ratings:      "text-yellow-400 border-yellow-400/20 hover:border-yellow-400/40",
  Timers:       "text-violet-400 border-violet-400/20 hover:border-violet-400/40",
  Reactions:    "text-pink-400 border-pink-400/20 hover:border-pink-400/40",
};

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  const sub = user ? await getSubscription() : null;
  const memberSince = user?.created_at ? formatDate(user.created_at) : null;

  const allAssets = await assetService.getLibrary();
  const featuredAssets = allAssets.filter(a => a.is_featured).slice(0, 4);
  const newestAssets = [...allAssets]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const newThisMonth = allAssets.filter(a => new Date(a.created_at).getTime() > thirtyDaysAgo).length;

  const email = user?.email ?? (demoMode ? "demo@psdfuel.com" : "");
  const initials = email.slice(0, 2).toUpperCase();

  const planLabel = sub?.plan_id === "yearly"
    ? "Yearly plan"
    : sub?.plan_id === "monthly"
    ? "Monthly plan"
    : demoMode
    ? "Demo access"
    : "Active";

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-10">

        {/* Welcome header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-content-primary">
                Welcome back
              </h1>
              <p className="text-sm text-content-muted">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-xs font-medium text-success">{planLabel}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: FolderOpen, label: "Total assets", value: allAssets.length.toString() },
            { icon: LayoutGrid, label: "Categories", value: siteConfig.categories.length.toString() },
            { icon: Sparkles, label: "New this month", value: newThisMonth > 0 ? `+${newThisMonth}` : "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-base-surface p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-base-overlay">
                <Icon className="h-4 w-4 text-content-muted" />
              </div>
              <p className="text-2xl font-semibold tracking-tight text-content-primary">{value}</p>
              <p className="mt-0.5 text-xs text-content-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Featured assets */}
        {featuredAssets.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-content-muted">
                Featured
              </h2>
              <Link
                href="/library?sort=featured"
                className="flex items-center gap-1 text-xs text-content-muted hover:text-content-primary transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {featuredAssets.map(asset => (
                <MemberAssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </section>
        )}

        {/* Newest assets */}
        {newestAssets.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-content-muted">
                Recently added
              </h2>
              <Link
                href="/library"
                className="flex items-center gap-1 text-xs text-content-muted hover:text-content-primary transition-colors"
              >
                Full library <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {newestAssets.map(asset => (
                <MemberAssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </section>
        )}

        {/* Browse by category */}
        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-content-muted">
              Browse by category
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {siteConfig.categories.map(category => {
              const colors = categoryColors[category] ?? "text-content-muted border-border hover:border-border-strong";
              return (
                <Link
                  key={category}
                  href={`/library?category=${encodeURIComponent(category)}`}
                  className={`flex items-center justify-center rounded-xl border bg-base-surface px-3 py-3 text-xs font-medium transition-colors ${colors}`}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Account info strip */}
        {memberSince && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-base-surface px-5 py-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-content-muted">Member since</p>
                <p className="text-sm font-medium text-content-primary">{memberSince}</p>
              </div>
              {sub?.current_period_end && (
                <div>
                  <p className="text-xs text-content-muted">
                    {sub.cancel_at_period_end ? "Access until" : "Next renewal"}
                  </p>
                  <p className="text-sm font-medium text-content-primary">
                    {formatDate(sub.current_period_end)}
                  </p>
                </div>
              )}
            </div>
            <Link
              href="/account"
              className="text-xs text-content-muted hover:text-content-primary transition-colors"
            >
              Manage account →
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
