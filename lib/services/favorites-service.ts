import type {
  IFavoritesRepository,
  FavoriteEntry,
} from "@/lib/repositories/favorites-repository";

export interface IFavoritesService {
  getFavorites(userId: string): Promise<FavoriteEntry[]>;
  addFavorite(userId: string, assetId: string): Promise<FavoriteEntry>;
  removeFavorite(userId: string, assetId: string): Promise<void>;
  isFavorited(userId: string, assetId: string): Promise<boolean>;
}

export class FavoritesService implements IFavoritesService {
  constructor(private repo: IFavoritesRepository) {}

  async getFavorites(userId: string): Promise<FavoriteEntry[]> {
    return this.repo.getByUserId(userId);
  }

  async addFavorite(userId: string, assetId: string): Promise<FavoriteEntry> {
    return this.repo.add(userId, assetId);
  }

  async removeFavorite(userId: string, assetId: string): Promise<void> {
    return this.repo.remove(userId, assetId);
  }

  async isFavorited(userId: string, assetId: string): Promise<boolean> {
    return this.repo.isFavorited(userId, assetId);
  }
}
