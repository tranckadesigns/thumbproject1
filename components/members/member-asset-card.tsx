import Link from "next/link";
import Image from "next/image";
import type { Asset } from "@/types/asset";
import { cn } from "@/lib/utils/cn";
import { formatFileSize } from "@/lib/utils/format";
import { FavoriteButton } from "@/components/members/favorite-button";
import { TiltCard } from "@/components/ui/tilt-card";

interface MemberAssetCardProps {
  asset: Asset;
  className?: string;
  isFavorited?: boolean;
}

const categoryColors: Record<string, string> = {
  Revenue:      "text-red-400 bg-red-500/15",
  Subscribers:  "text-red-400 bg-red-500/15",
  Growth:       "text-emerald-400 bg-emerald-500/15",
  Alerts:       "text-yellow-400 bg-yellow-500/15",
  Social:       "text-purple-400 bg-purple-500/15",
  "E-Commerce": "text-lime-400 bg-lime-500/15",
  Analytics:    "text-amber-400 bg-amber-500/15",
  Challenges:   "text-orange-400 bg-orange-500/15",
  Comparisons:  "text-sky-400 bg-sky-500/15",
  Ratings:      "text-amber-400 bg-amber-500/15",
  Timers:       "text-violet-400 bg-violet-500/15",
  Reactions:    "text-pink-400 bg-pink-500/15",
};

function isNew(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  return now - created < fourteenDays;
}

export function MemberAssetCard({ asset, className, isFavorited = false }: MemberAssetCardProps) {
  const fresh = isNew(asset.created_at);
  const badgeColor = categoryColors[asset.category] ?? "text-content-muted bg-base-elevated";

  return (
    <Link href={`/asset/${asset.slug}`} className={cn("group block", className)}>
      {/* Preview */}
      <TiltCard>
      <div className={cn(
        "relative aspect-video overflow-hidden rounded-xl border border-border transition-all duration-300 group-hover:border-border-strong",
        asset.is_featured
          ? "group-hover:shadow-[0_16px_40px_-8px_rgba(201,169,110,0.12)]"
          : "group-hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)]"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#161616]" />

        {/* Favorite button */}
        <div className="absolute right-2.5 top-2.5 z-10">
          <FavoriteButton assetId={asset.id} initialFavorited={isFavorited} />
        </div>

        {/* Badges — top left */}
        {(asset.is_featured || fresh) && (
          <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1">
            {asset.is_featured && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-accent/30 bg-black/60 text-accent backdrop-blur-sm" title="Staff Pick">
                <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M6 0l1.5 4H12l-3.7 2.7 1.4 4.3L6 8.4l-3.7 2.6 1.4-4.3L0 4h4.5z" />
                </svg>
              </span>
            )}
            {fresh && (
              <span className="rounded-full border border-emerald-500/25 bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm">
                New
              </span>
            )}
          </div>
        )}

        {/* Thumbnail — PNG with transparency floats on dark background */}
        {asset.thumbnail_url && (
          <Image
            src={asset.thumbnail_url}
            alt={asset.title}
            fill
            className="object-contain p-5"
            style={{ filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.55))" }}
            unoptimized
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            View asset →
          </span>
        </div>
      </div>
      </TiltCard>

      {/* Meta */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-content-primary transition-colors duration-150 group-hover:text-accent">
            {asset.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-content-muted">
            {asset.short_description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", badgeColor)}>
            {asset.category}
          </span>
<span className="text-[10px] text-content-muted/50">
            {formatFileSize(asset.file_size_mb)}
          </span>
        </div>
      </div>
    </Link>
  );
}
