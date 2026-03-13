import Link from "next/link";
import type { Asset } from "@/types/asset";
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

// ─── Component ────────────────────────────────────────────────────────────────

interface MemberAssetCardProps {
  asset: Asset;
  className?: string;
}

export function MemberAssetCard({ asset, className }: MemberAssetCardProps) {
  const overlayKey = categoryOverlayMap[asset.category];
  const OverlayComponent = overlayComponents[overlayKey];

  return (
    <Link
      href={`/asset/${asset.slug}`}
      className={cn("group block", className)}
    >
      {/* Preview area */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-base-elevated aspect-[16/10] transition-all duration-200 group-hover:border-border-strong group-hover:shadow-elevated">
        {/* Thumbnail background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#1a1a1a]" />

        {/* Texture lines */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end gap-1.5 opacity-20">
          <div className="h-2 w-3/4 rounded bg-white/20" />
          <div className="h-1.5 w-1/2 rounded bg-white/15" />
        </div>

        {/* Overlay */}
        <OverlayComponent />

        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium",
              categoryBadgeColors[asset.category]
            )}
          >
            {asset.category}
          </span>
        </div>

        {/* Hover overlay — view prompt */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            View asset →
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 px-0.5">
        <p className="text-sm font-medium text-content-primary truncate group-hover:text-accent transition-colors">
          {asset.title}
        </p>
        <p className="mt-0.5 text-xs text-content-muted truncate">
          {asset.short_description}
        </p>
      </div>
    </Link>
  );
}
