export interface FavoriteEntry {
  id: string;
  user_id: string;
  asset_id: string;
  saved_at: string;
}

export interface IFavoritesRepository {
  getByUserId(userId: string): Promise<FavoriteEntry[]>;
  add(userId: string, assetId: string): Promise<FavoriteEntry>;
  remove(userId: string, assetId: string): Promise<void>;
  isFavorited(userId: string, assetId: string): Promise<boolean>;
}

// Mock implementation — in-memory, per session.
// Replace with Supabase adapter in Phase 8.
export class MockFavoritesRepository implements IFavoritesRepository {
  private favorites: FavoriteEntry[] = [];

  async getByUserId(userId: string): Promise<FavoriteEntry[]> {
    return this.favorites.filter((f) => f.user_id === userId);
  }

  async add(userId: string, assetId: string): Promise<FavoriteEntry> {
    const existing = this.favorites.find(
      (f) => f.user_id === userId && f.asset_id === assetId
    );
    if (existing) return existing;

    const entry: FavoriteEntry = {
      id: `fav-${Date.now()}`,
      user_id: userId,
      asset_id: assetId,
      saved_at: new Date().toISOString(),
    };
    this.favorites.push(entry);
    return entry;
  }

  async remove(userId: string, assetId: string): Promise<void> {
    this.favorites = this.favorites.filter(
      (f) => !(f.user_id === userId && f.asset_id === assetId)
    );
  }

  async isFavorited(userId: string, assetId: string): Promise<boolean> {
    return this.favorites.some(
      (f) => f.user_id === userId && f.asset_id === assetId
    );
  }
}
