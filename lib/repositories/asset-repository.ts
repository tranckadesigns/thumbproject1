import type { Asset, AssetCategory } from "@/types/asset";

export interface AssetFilters {
  category?: AssetCategory;
  tags?: string[];
  search?: string;
  featured?: boolean;
}

export interface IAssetRepository {
  getAll(filters?: AssetFilters): Promise<Asset[]>;
  getAllAdmin(): Promise<Asset[]>;
  getBySlug(slug: string): Promise<Asset | null>;
  getById(id: string): Promise<Asset | null>;
  getFeatured(): Promise<Asset[]>;
  getRecent(limit: number): Promise<Asset[]>;
  getByCategory(category: AssetCategory): Promise<Asset[]>;
  create(data: Omit<Asset, "id" | "created_at">): Promise<Asset>;
  update(id: string, data: Partial<Omit<Asset, "id" | "created_at">>): Promise<Asset>;
  delete(id: string): Promise<void>;
}
