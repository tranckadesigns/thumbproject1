export interface DownloadEntry {
  id: string;
  user_id: string;
  asset_id: string;
  downloaded_at: string;
}

export interface IDownloadsRepository {
  getByUserId(userId: string): Promise<DownloadEntry[]>;
  log(userId: string, assetId: string): Promise<DownloadEntry>;
  hasDownloaded(userId: string, assetId: string): Promise<boolean>;
}

// Mock implementation — in-memory, per session.
// Replace with Supabase adapter in Phase 8.
export class MockDownloadsRepository implements IDownloadsRepository {
  private downloads: DownloadEntry[] = [];

  async getByUserId(userId: string): Promise<DownloadEntry[]> {
    return this.downloads.filter((d) => d.user_id === userId);
  }

  async log(userId: string, assetId: string): Promise<DownloadEntry> {
    const entry: DownloadEntry = {
      id: `dl-${Date.now()}`,
      user_id: userId,
      asset_id: assetId,
      downloaded_at: new Date().toISOString(),
    };
    this.downloads.push(entry);
    return entry;
  }

  async hasDownloaded(userId: string, assetId: string): Promise<boolean> {
    return this.downloads.some(
      (d) => d.user_id === userId && d.asset_id === assetId
    );
  }
}
