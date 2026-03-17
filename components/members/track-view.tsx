"use client";

import { useEffect } from "react";
import type { AssetCategory, StyleType } from "@/types/asset";

export interface TrackedAsset {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: AssetCategory;
  style_type: StyleType;
  thumbnail_url: string;
  file_size_mb: number;
  is_featured: boolean;
  created_at: string;
  download_count?: number;
}

const STORAGE_KEY = "psdfuel_recently_viewed";
const MAX_ITEMS = 4;

export function TrackView({ asset }: { asset: TrackedAsset }) {
  useEffect(() => {
    try {
      const existing: TrackedAsset[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
      );
      // Remove current asset + any pre-existing duplicates, then prepend
      const seen = new Set<string>([asset.id]);
      const deduped = existing.filter((a) => {
        if (!a.id || seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });
      const updated = [asset, ...deduped].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage not available — skip silently
    }
  }, [asset.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
