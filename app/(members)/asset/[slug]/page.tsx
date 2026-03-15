import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileImage, Tag } from "lucide-react";
import {
  YouTubeRevenueOverlay,
  StripePayoutOverlay,
  SubscriberMilestoneOverlay,
  ShopifySalesOverlay,
  CTRAnalyticsOverlay,
  InstagramAlertOverlay,
  GrowthChartOverlay,
  AlertBannerOverlay,
  BestWorstOverlay,
  RatingStarsOverlay,
  CountdownTimerOverlay,
  ChallengeProgressOverlay,
  PollResultOverlay,
  ReactionBubbleOverlay,
  BeforeAfterOverlay,
  AdSenseRevenueOverlay,
  PayPalPayoutOverlay,
  LiveTickerOverlay,
  OneMilOverlay,
  WeeklyGainOverlay,
  ViewsMilestoneOverlay,
  ChannelStatsOverlay,
  BreakingNewsOverlay,
  NotificationCardOverlay,
  TwitterCardOverlay,
  TikTokFYPOverlay,
  DigitalSaleOverlay,
  CourseEnrollmentOverlay,
  WatchTimeOverlay,
  ImpressionsOverlay,
  HundredDayChallengeOverlay,
  WeeklyStreakOverlay,
  OldVsNewOverlay,
  ProductScoreOverlay,
  AppStoreRatingOverlay,
  EventCountdownOverlay,
  StreamGoLiveOverlay,
  CommunityVoteOverlay,
  LiveChatOverlay,
} from "@/components/marketing/asset-overlays";
import type { AssetCategory } from "@/types/asset";
import { assetService } from "@/lib/services/index";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { DownloadButton } from "@/components/members/download-button";
import { FavoriteButton } from "@/components/members/favorite-button";
import { CopyButton } from "@/components/ui/copy-button";
import { TrackView } from "@/components/members/track-view";
import { siteConfig } from "@/lib/config/site";
import { MemberAssetCard } from "@/components/members/member-asset-card";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

async function getFavoriteIds(): Promise<Set<string>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return new Set();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase.from("favorites").select("asset_id").eq("user_id", user.id);
  return new Set((data ?? []).map((r: { asset_id: string }) => r.asset_id));
}

// ─── Per-slug overlay mapping (matches library cards exactly) ─────────────────

const slugOverlayMap: Record<string, () => React.ReactElement> = {
  "youtube-revenue-alert":       YouTubeRevenueOverlay,
  "stripe-payout-notification":  StripePayoutOverlay,
  "adsense-revenue-card":        AdSenseRevenueOverlay,
  "paypal-payout-badge":         PayPalPayoutOverlay,
  "100k-subscriber-milestone":   SubscriberMilestoneOverlay,
  "subscriber-count-ticker":     LiveTickerOverlay,
  "1m-subscriber-badge":         OneMilOverlay,
  "weekly-subscriber-gain":      WeeklyGainOverlay,
  "viral-growth-chart":          GrowthChartOverlay,
  "views-milestone-popup":       ViewsMilestoneOverlay,
  "channel-performance-card":    ChannelStatsOverlay,
  "real-time-alert-banner":      AlertBannerOverlay,
  "breaking-update-banner":      BreakingNewsOverlay,
  "important-notification-card": NotificationCardOverlay,
  "instagram-follower-spike":    InstagramAlertOverlay,
  "twitter-viral-card":          TwitterCardOverlay,
  "tiktok-fyp-badge":            TikTokFYPOverlay,
  "shopify-sales-dashboard":     ShopifySalesOverlay,
  "digital-product-sale-badge":  DigitalSaleOverlay,
  "course-enrollment-counter":   CourseEnrollmentOverlay,
  "ctr-analytics-display":       CTRAnalyticsOverlay,
  "watch-time-dashboard":        WatchTimeOverlay,
  "impressions-analytics-card":  ImpressionsOverlay,
  "30-day-challenge-progress":   ChallengeProgressOverlay,
  "100-day-challenge-tracker":   HundredDayChallengeOverlay,
  "weekly-streak-badge":         WeeklyStreakOverlay,
  "best-vs-worst-comparison":    BestWorstOverlay,
  "before-after-reveal":         BeforeAfterOverlay,
  "old-vs-new-comparison":       OldVsNewOverlay,
  "five-star-rating-display":    RatingStarsOverlay,
  "product-score-badge":         ProductScoreOverlay,
  "app-store-rating-card":       AppStoreRatingOverlay,
  "launch-countdown-timer":      CountdownTimerOverlay,
  "live-event-countdown":        EventCountdownOverlay,
  "stream-golive-timer":         StreamGoLiveOverlay,
  "poll-result-overlay":         PollResultOverlay,
  "reaction-bubble-overlay":     ReactionBubbleOverlay,
  "community-vote-card":         CommunityVoteOverlay,
  "live-chat-reactions":         LiveChatOverlay,
};

const categoryBadgeColors: Record<AssetCategory, string> = {
  Revenue: "bg-red-500/15 text-red-400",
  Subscribers: "bg-red-500/15 text-red-400",
  Growth: "bg-emerald-500/15 text-emerald-400",
  Alerts: "bg-yellow-500/15 text-yellow-400",
  Social: "bg-purple-500/15 text-purple-400",
  "E-Commerce": "bg-lime-500/15 text-lime-400",
  Analytics: "bg-amber-500/15 text-amber-400",
  Challenges: "bg-orange-500/15 text-orange-400",
  Comparisons: "bg-sky-500/15 text-sky-400",
  Ratings: "bg-amber-500/15 text-amber-400",
  Timers: "bg-violet-500/15 text-violet-400",
  Reactions: "bg-pink-500/15 text-pink-400",
};

// ─── Seeded download count ────────────────────────────────────────────────────
// Gives every asset a consistent baseline between 407–1219 so the counter
// never looks empty on a newly launched site. The offset is derived from the
// asset ID so it's always the same for the same asset.
function seededDownloadCount(id: string, real: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(h * 31 + id.charCodeAt(i), 1) | 0;
  }
  const offset = 407 + (Math.abs(h) % (1219 - 407 + 1));
  return offset + real;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface AssetPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AssetPageProps): Promise<Metadata> {
  const { slug } = await params;
  const asset = await assetService.getAsset(slug);
  if (!asset) return { title: "Asset" };

  const description = `${asset.short_description} — Fully editable PSD file. Download instantly with a PSDfuel membership.`;

  return {
    title: asset.title,
    description,
    openGraph: {
      title: `${asset.title} — PSDfuel`,
      description,
      ...(asset.thumbnail_url ? { images: [{ url: asset.thumbnail_url, width: 1200, height: 630, alt: asset.title }] } : {}),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${asset.title} — PSDfuel`,
      description,
      ...(asset.thumbnail_url ? { images: [asset.thumbnail_url] } : {}),
    },
  };
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { slug } = await params;
  const asset = await assetService.getAsset(slug);

  if (!asset) notFound();

  const OverlayComponent = slugOverlayMap[asset.slug] ?? YouTubeRevenueOverlay;

  // Favorites + related assets in parallel
  const [favoriteIds, allAssets] = await Promise.all([
    getFavoriteIds(),
    assetService.getLibrary(),
  ]);
  const isFavorited = favoriteIds.has(asset.id);
  const relatedAssets = allAssets
    .filter((a) => a.category === asset.category && a.id !== asset.id)
    .slice(0, 4);

  return (
    <div className="px-6 py-10">
      <TrackView asset={{
        id: asset.id,
        slug: asset.slug,
        title: asset.title,
        short_description: asset.short_description,
        category: asset.category,
        style_type: asset.style_type,
        thumbnail_url: asset.thumbnail_url,
        file_size_mb: asset.file_size_mb,
        is_featured: asset.is_featured,
        created_at: asset.created_at,
        download_count: asset.download_count,
      }} />
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-content-muted">
          <Link href="/library" className="hover:text-content-primary transition-colors">Library</Link>
          <span>/</span>
          <Link href={`/library?category=${asset.category}`} className="hover:text-content-primary transition-colors">{asset.category}</Link>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Preview */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-border bg-base-elevated aspect-[16/10]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#1a1a1a]" />
              {asset.thumbnail_url ? (
                <Image
                  src={asset.thumbnail_url}
                  alt={asset.title}
                  fill
                  className="object-contain p-8"
                  style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.6))" }}
                  unoptimized
                  priority
                />
              ) : (
                <>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end gap-1.5 opacity-20">
                    <div className="h-2.5 w-3/4 rounded bg-white/20" />
                    <div className="h-2 w-1/2 rounded bg-white/15" />
                  </div>
                  <OverlayComponent />
                </>
              )}
            </div>

            <p className="text-xs text-center text-content-muted">
              {asset.thumbnail_url ? "Preview" : "Live preview — overlay shown at scale"}
            </p>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Title + category */}
            <div>
              <div className="mb-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    categoryBadgeColors[asset.category]
                  )}
                >
                  {asset.category}
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
                {asset.title}
              </h1>
              <p className="mt-2 text-content-secondary leading-relaxed">
                {asset.short_description}
              </p>
            </div>

            {/* Download + Favorite + Copy */}
            <div className="flex items-center gap-3">
              <DownloadButton assetId={asset.id} slug={asset.slug} className="flex-1 sm:flex-none" />
              <FavoriteButton
                assetId={asset.id}
                initialFavorited={isFavorited}
                alwaysVisible
                size="md"
              />
              <CopyButton url={`${siteConfig.url}/asset/${asset.slug}`} />
            </div>

            {/* Description */}
            <div className="rounded-xl border border-border bg-base-surface p-5">
              <p className="text-sm leading-relaxed text-content-secondary">
                {asset.full_description}
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-base-surface px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <FileImage className="h-3.5 w-3.5 text-accent" />
                  <p className="text-xs font-medium text-content-muted uppercase tracking-wide">
                    File size
                  </p>
                </div>
                <p className="text-sm font-semibold text-content-primary">
                  {formatFileSize(asset.file_size_mb)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-base-surface px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="h-3.5 w-3.5 text-accent" />
                  <p className="text-xs font-medium text-content-muted uppercase tracking-wide">
                    Version
                  </p>
                </div>
                <p className="text-sm font-semibold text-content-primary">
                  v{asset.version}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-base-surface px-4 py-3">
                <p className="text-xs font-medium text-content-muted uppercase tracking-wide mb-1">Style</p>
                <p className="text-sm font-semibold text-content-primary">{asset.style_type}</p>
              </div>

              <div className="rounded-xl border border-border bg-base-surface px-4 py-3">
                <p className="text-xs font-medium text-content-muted uppercase tracking-wide mb-1">Downloads</p>
                <p className="text-sm font-semibold text-content-primary">
                  {seededDownloadCount(asset.id, asset.download_count ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Tags */}
            {asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-base-elevated px-2.5 py-0.5 text-xs text-content-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Related assets */}
        <section className="mt-14">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-content-muted">
            More in {asset.category}
          </h2>
          {relatedAssets.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedAssets.map((related) => (
                <MemberAssetCard
                  key={related.id}
                  asset={related}
                  isFavorited={favoriteIds.has(related.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-content-muted">
              No other assets in this category yet.{" "}
              <Link href="/library" className="underline underline-offset-2 hover:text-content-secondary transition-colors">
                Browse full library →
              </Link>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
