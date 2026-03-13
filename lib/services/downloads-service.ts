import type {
  IDownloadsRepository,
  DownloadEntry,
} from "@/lib/repositories/downloads-repository";
import type { SubscriptionStatus } from "@/types/profile";

export interface DownloadResult {
  success: boolean;
  reason?: "not_subscribed" | "download_error";
  entry?: DownloadEntry;
}

export interface IDownloadsService {
  canDownload(subscriptionStatus: SubscriptionStatus): boolean;
  requestDownload(
    userId: string,
    assetId: string,
    subscriptionStatus: SubscriptionStatus
  ): Promise<DownloadResult>;
  getDownloadHistory(userId: string): Promise<DownloadEntry[]>;
}

export class DownloadsService implements IDownloadsService {
  constructor(private repo: IDownloadsRepository) {}

  canDownload(subscriptionStatus: SubscriptionStatus): boolean {
    return subscriptionStatus === "active";
  }

  async requestDownload(
    userId: string,
    assetId: string,
    subscriptionStatus: SubscriptionStatus
  ): Promise<DownloadResult> {
    if (!this.canDownload(subscriptionStatus)) {
      return { success: false, reason: "not_subscribed" };
    }
    const entry = await this.repo.log(userId, assetId);
    return { success: true, entry };
  }

  async getDownloadHistory(userId: string): Promise<DownloadEntry[]> {
    return this.repo.getByUserId(userId);
  }
}
