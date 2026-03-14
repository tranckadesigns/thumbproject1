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
  getByCategory(category: AssetCategory): Promise<Asset[]>;
}

// Mock implementation — replace with Supabase adapter in Phase 8.
export class MockAssetRepository implements IAssetRepository {
  private assets: Asset[];

  constructor(seed: Asset[] = []) {
    this.assets = seed;
  }

  async getAllAdmin(): Promise<Asset[]> {
    return [...this.assets].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getAll(filters?: AssetFilters): Promise<Asset[]> {
    let results = this.assets.filter((a) => a.is_published);

    if (filters?.category) {
      results = results.filter((a) => a.category === filters.category);
    }
    if (filters?.featured) {
      results = results.filter((a) => a.is_featured);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.short_description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return results;
  }

  async getBySlug(slug: string): Promise<Asset | null> {
    return this.assets.find((a) => a.slug === slug) ?? null;
  }

  async getById(id: string): Promise<Asset | null> {
    return this.assets.find((a) => a.id === id) ?? null;
  }

  async getFeatured(): Promise<Asset[]> {
    return this.assets.filter((a) => a.is_featured && a.is_published);
  }

  async getByCategory(category: AssetCategory): Promise<Asset[]> {
    return this.assets.filter(
      (a) => a.category === category && a.is_published
    );
  }
}
