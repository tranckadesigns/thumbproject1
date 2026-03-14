import { MockAssetRepository } from "@/lib/repositories/asset-repository";
import { SupabaseAssetRepository } from "@/lib/repositories/supabase-asset-repository";
import { MockDownloadsRepository } from "@/lib/repositories/downloads-repository";
import { MockFavoritesRepository } from "@/lib/repositories/favorites-repository";
import { AssetService } from "@/lib/services/asset-service";
import { DownloadsService } from "@/lib/services/downloads-service";
import { FavoritesService } from "@/lib/services/favorites-service";
import { mockAssets } from "@/lib/mock/mock-assets";

const useSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export const assetService = new AssetService(
  useSupabase
    ? new SupabaseAssetRepository()
    : new MockAssetRepository(mockAssets)
);

export const downloadsService = new DownloadsService(new MockDownloadsRepository());
export const favoritesService = new FavoritesService(new MockFavoritesRepository());
