"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { MemberAssetCard } from "@/components/members/member-asset-card";
import type { TrackedAsset } from "@/components/members/track-view";
import type { Asset } from "@/types/asset";

const STORAGE_KEY = "psdfuel_recently_viewed";

// TrackedAsset has all fields MemberAssetCard needs — cast via spread
function toAsset(t: TrackedAsset): Asset {
  return {
    ...t,
    full_description: "",
    preview_images: [],
    psd_file_key: "",
    version: "1.0",
    is_published: true,
    tags: [],
  };
}

interface RecentlyViewedProps {
  favoriteIds?: string[];
}

export function RecentlyViewed({ favoriteIds = [] }: RecentlyViewedProps) {
  const [assets, setAssets] = useState<TrackedAsset[]>([]);

  useEffect(() => {
    try {
      const raw: TrackedAsset[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
      );
      // Filter out old-format entries that are missing required fields
      const valid = raw.filter(
        (a) => a.id && a.slug && a.category && typeof a.file_size_mb === "number"
      );
      setAssets(valid);
    } catch {
      // localStorage not available
    }
  }, []);

  if (assets.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-content-muted" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-content-muted">
          Recently viewed
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {assets.map((asset) => (
          <MemberAssetCard key={asset.id} asset={toAsset(asset)} isFavorited={favoriteIds.includes(asset.id)} />
        ))}
      </div>
    </section>
  );
}
