import type { Asset, AssetCategory } from "@/types/asset";
import type {
  IAssetRepository,
  AssetFilters,
} from "@/lib/repositories/asset-repository";

export interface IAssetService {
  getLibrary(filters?: AssetFilters): Promise<Asset[]>;
  getAsset(slug: string): Promise<Asset | null>;
  getFeatured(): Promise<Asset[]>;
  getByCategory(category: AssetCategory): Promise<Asset[]>;
}

export class AssetService implements IAssetService {
  constructor(private repo: IAssetRepository) {}

  async getLibrary(filters?: AssetFilters): Promise<Asset[]> {
    return this.repo.getAll(filters);
  }

  async getAsset(slug: string): Promise<Asset | null> {
    return this.repo.getBySlug(slug);
  }

  async getFeatured(): Promise<Asset[]> {
    return this.repo.getFeatured();
  }

  async getByCategory(category: AssetCategory): Promise<Asset[]> {
    return this.repo.getByCategory(category);
  }
}
