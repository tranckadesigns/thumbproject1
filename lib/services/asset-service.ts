import type { Asset, AssetCategory } from "@/types/asset";
import type {
  IAssetRepository,
  AssetFilters,
} from "@/lib/repositories/asset-repository";

export interface IAssetService {
  getLibrary(filters?: AssetFilters): Promise<Asset[]>;
  getAllAdmin(): Promise<Asset[]>;
  getAsset(slug: string): Promise<Asset | null>;
  getAssetById(id: string): Promise<Asset | null>;
  getFeatured(): Promise<Asset[]>;
  getByCategory(category: AssetCategory): Promise<Asset[]>;
  createAsset(data: Omit<Asset, "id" | "created_at">): Promise<Asset>;
  updateAsset(id: string, data: Partial<Omit<Asset, "id" | "created_at">>): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;
}

export class AssetService implements IAssetService {
  constructor(private repo: IAssetRepository) {}

  async getLibrary(filters?: AssetFilters): Promise<Asset[]> {
    return this.repo.getAll(filters);
  }

  async getAllAdmin(): Promise<Asset[]> {
    return this.repo.getAllAdmin();
  }

  async getAsset(slug: string): Promise<Asset | null> {
    return this.repo.getBySlug(slug);
  }

  async getAssetById(id: string): Promise<Asset | null> {
    return this.repo.getById(id);
  }

  async getFeatured(): Promise<Asset[]> {
    return this.repo.getFeatured();
  }

  async getRecent(limit = 4): Promise<Asset[]> {
    return this.repo.getRecent(limit);
  }

  async getByCategory(category: AssetCategory): Promise<Asset[]> {
    return this.repo.getByCategory(category);
  }

  async createAsset(data: Omit<Asset, "id" | "created_at">): Promise<Asset> {
    return this.repo.create(data);
  }

  async updateAsset(id: string, data: Partial<Omit<Asset, "id" | "created_at">>): Promise<Asset> {
    return this.repo.update(id, data);
  }

  async deleteAsset(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
