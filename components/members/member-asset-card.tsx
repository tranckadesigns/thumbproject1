import Link from "next/link";
import Image from "next/image";
import type { Asset } from "@/types/asset";
import { cn } from "@/lib/utils/cn";
import { formatFileSize } from "@/lib/utils/format";
import { FavoriteButton } from "@/components/members/favorite-button";

interface MemberAssetCardProps {
  asset: Asset;
  className?: string;
  isFavorited?: boolean;
}

const categoryColors: Record<string, string> = {
  Revenue:      "text-amber-400 bg-amber-400/10",
  Subscribers:  "text-red-400 bg-red-400/10",
  Growth:       "text-emerald-400 bg-emerald-400/10",
  Alerts:       "text-yellow-400 bg-yellow-400/10",
  Social:       "text-purple-400 bg-purple-400/10",
  "E-Commerce": "text-lime-400 bg-lime-400/10",
  Analytics:    "text-sky-400 bg-sky-400/10",
  Challenges:   "text-orange-400 bg-orange-400/10",
  Comparisons:  "text-slate-400 bg-slate-400/10",
  Ratings:      "text-yellow-400 bg-yellow-400/10",
  Timers:       "text-violet-400 bg-violet-400/10",
  Reactions:    "text-pink-400 bg-pink-400/10",
};

function isNew(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const sixtyDays = 60 * 24 * 60 * 60 * 1000;
  return now - created < sixtyDays;
}

export function MemberAssetCard({ asset, className, isFavorited = false }: MemberAssetCardProps) {
  const fresh = isNew(asset.created_at);
  const badgeColor = categoryColors[asset.category] ?? "text-content-muted bg-base-elevated";

  return (
    <Link href={`/asset/${asset.slug}`} className={cn("group block", className)}>
      {/* Preview */}
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border transition-all duration-300 group-hover:border-border-strong group-hover:shadow-elevated">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#161616]" />

        {/* Favorite button */}
        <div className="absolute right-2.5 top-2.5 z-10">
          <FavoriteButton assetId={asset.id} initialFavorited={isFavorited} />
        </div>

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          {asset.is_featured && (
            <span className="rounded-full border border-accent/25 bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-accent backdrop-blur-sm">
              Featured
            </span>
          )}
          {fresh && !asset.is_featured && (
            <span className="rounded-full border border-emerald-500/25 bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm">
              New
            </span>
          )}
        </div>

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
