import { assetService } from "@/lib/services/index";
import { siteConfig } from "@/lib/config/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Starting offset — real subscribers are added on top of this
const CREATOR_OFFSET = 1229;

export interface LibraryStats {
  assetCount: number;
  categoryCount: number;
  creatorCount: number;
}

export async function getLibraryStats(): Promise<LibraryStats> {
  const [assets, creatorCount] = await Promise.all([
    assetService.getLibrary(),
    getCreatorCount(),
  ]);

  return {
    assetCount: assets.length,
    categoryCount: siteConfig.categories.length,
    creatorCount,
  };
}

async function getCreatorCount(): Promise<number> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return CREATOR_OFFSET;

  const { count } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .in("status", ["active", "trialing"]);

  const liveCount = count ?? 0;
  // Only add live count when meaningful — prevents display flickering
  // between e.g. 1229+ and 1230+ at low subscriber counts near launch
  return CREATOR_OFFSET + (liveCount >= 10 ? liveCount : 0);
}
