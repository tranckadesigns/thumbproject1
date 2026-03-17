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
const VERSION_KEY = "psdfuel_rv_version";
const CURRENT_VERSION = "2";
const MAX_ITEMS = 4;

function getStorage(): TrackedAsset[] {
  try {
    if (localStorage.getItem(VERSION_KEY) !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return [];
    }
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function TrackView({ asset }: { asset: TrackedAsset }) {
  useEffect(() => {
    try {
      const existing = getStorage();
      // Deduplicate by slug (stable) — not id (changes on re-upload)
      const seen = new Set<string>([asset.slug]);
      const deduped = existing.filter((a) => {
        if (!a.slug || seen.has(a.slug)) return false;
        seen.add(a.slug);
        return true;
      });
      // Prepend latest version of this asset (overwrites stale data)
      const updated = [asset, ...deduped].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage not available — skip silently
    }
  }, [asset.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
