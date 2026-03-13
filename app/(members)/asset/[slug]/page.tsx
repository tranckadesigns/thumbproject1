import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileImage, Tag } from "lucide-react";
import type { OverlayType } from "@/components/marketing/asset-overlays";
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
} from "@/components/marketing/asset-overlays";
import type { AssetCategory } from "@/types/asset";
import { assetService } from "@/lib/services/index";
import { DownloadButton } from "@/components/members/download-button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

// ─── Overlay mapping ───────────────────────────────────────────────────────────

const categoryOverlayMap: Record<AssetCategory, OverlayType> = {
  Revenue: "revenue",
  Subscribers: "milestone",
  Growth: "growth",
  Alerts: "alert",
  Social: "instagram",
  Commerce: "shopify",
  Analytics: "ctr",
  Challenges: "challenge",
  Comparisons: "bestworst",
  Ratings: "rating",
  Timers: "countdown",
  Reactions: "reaction",
};

const overlayComponents: Record<OverlayType, () => React.ReactElement> = {
  revenue: YouTubeRevenueOverlay,
  payout: StripePayoutOverlay,
  milestone: SubscriberMilestoneOverlay,
  shopify: ShopifySalesOverlay,
  ctr: CTRAnalyticsOverlay,
  instagram: InstagramAlertOverlay,
  growth: GrowthChartOverlay,
  alert: AlertBannerOverlay,
  bestworst: BestWorstOverlay,
  rating: RatingStarsOverlay,
  countdown: CountdownTimerOverlay,
  challenge: ChallengeProgressOverlay,
  poll: PollResultOverlay,
  reaction: ReactionBubbleOverlay,
  beforeafter: BeforeAfterOverlay,
};

const categoryBadgeColors: Record<AssetCategory, string> = {
  Revenue: "bg-red-500/15 text-red-400",
  Subscribers: "bg-red-500/15 text-red-400",
  Growth: "bg-emerald-500/15 text-emerald-400",
  Alerts: "bg-yellow-500/15 text-yellow-400",
  Social: "bg-purple-500/15 text-purple-400",
  Commerce: "bg-lime-500/15 text-lime-400",
  Analytics: "bg-amber-500/15 text-amber-400",
  Challenges: "bg-orange-500/15 text-orange-400",
  Comparisons: "bg-sky-500/15 text-sky-400",
  Ratings: "bg-amber-500/15 text-amber-400",
  Timers: "bg-violet-500/15 text-violet-400",
  Reactions: "bg-pink-500/15 text-pink-400",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

interface AssetPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AssetPageProps): Promise<Metadata> {
  const { slug } = await params;
  const asset = await assetService.getAsset(slug);
  return { title: asset?.title ?? "Asset" };
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { slug } = await params;
  const asset = await assetService.getAsset(slug);

  if (!asset) notFound();

  const overlayKey = categoryOverlayMap[asset.category];
  const OverlayComponent = overlayComponents[overlayKey];

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Back link */}
        <Link
          href="/library"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-content-muted hover:text-content-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to library
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Preview */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-border bg-base-elevated aspect-[16/10]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#1a1a1a]" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end gap-1.5 opacity-20">
                <div className="h-2.5 w-3/4 rounded bg-white/20" />
                <div className="h-2 w-1/2 rounded bg-white/15" />
              </div>
              <OverlayComponent />
            </div>

            <p className="text-xs text-center text-content-muted">
              Live preview — overlay shown at scale
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

            {/* Download */}
            <DownloadButton assetId={asset.id} slug={asset.slug} className="w-full sm:w-auto" />

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

              <div className="col-span-2 rounded-xl border border-border bg-base-surface px-4 py-3">
                <p className="text-xs font-medium text-content-muted uppercase tracking-wide mb-2">
                  Style
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{asset.style_type}</Badge>
                  <Badge variant="secondary">{asset.platform_type}</Badge>
                </div>
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
      </div>
    </div>
  );
}
