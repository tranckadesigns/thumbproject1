// Favorites are managed in local app state via the FavoritesRepository.
// This module defines the initial shape for the mock favorites layer.

export interface MockFavoriteEntry {
  user_id: string;
  asset_id: string;
  saved_at: string;
}

// Starts empty — populated at runtime via the favorites service.
export const mockFavorites: MockFavoriteEntry[] = [];
