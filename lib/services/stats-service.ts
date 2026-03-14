import { assetService } from "@/lib/services/index";
import { siteConfig } from "@/lib/config/site";

export interface LibraryStats {
  assetCount: number;
  categoryCount: number;
}

/**
 * Returns live library stats derived from the asset service.
 * Phase 8: swap assetService.getLibrary() for a direct Supabase COUNT query.
 */
export async function getLibraryStats(): Promise<LibraryStats> {
  const assets = await assetService.getLibrary();
  return {
    assetCount: assets.length,
    categoryCount: siteConfig.categories.length,
  };
}
