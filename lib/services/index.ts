import { MockAssetRepository } from "@/lib/repositories/asset-repository";
import { MockDownloadsRepository } from "@/lib/repositories/downloads-repository";
import { MockFavoritesRepository } from "@/lib/repositories/favorites-repository";
import { AssetService } from "@/lib/services/asset-service";
import { DownloadsService } from "@/lib/services/downloads-service";
import { FavoritesService } from "@/lib/services/favorites-service";
import { mockAssets } from "@/lib/mock/mock-assets";

export const assetService = new AssetService(new MockAssetRepository(mockAssets));
export const downloadsService = new DownloadsService(new MockDownloadsRepository());
export const favoritesService = new FavoritesService(new MockFavoritesRepository());
