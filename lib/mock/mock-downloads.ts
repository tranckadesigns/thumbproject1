// Download log entries for the demo download flow.
// Populated at runtime via the downloads service.

export interface MockDownloadEntry {
  id: string;
  user_id: string;
  asset_id: string;
  downloaded_at: string;
}

export const mockDownloads: MockDownloadEntry[] = [];
