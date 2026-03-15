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
      const filtered = existing.filter((a) => a.id !== asset.id);
      const updated = [asset, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage not available — skip silently
    }
  }, [asset.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
