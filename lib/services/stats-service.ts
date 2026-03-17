import { assetService } from "@/lib/services/index";
import { siteConfig } from "@/lib/config/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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
  return 1200;
}
