import { SupabaseAssetRepository } from "@/lib/repositories/supabase-asset-repository";
import { AssetService } from "@/lib/services/asset-service";

export const assetService = new AssetService(new SupabaseAssetRepository());
