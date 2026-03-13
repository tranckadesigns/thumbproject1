// Storage Adapter Boundary
//
// This is the future integration point for real file storage (e.g. S3, R2, Cloudflare).
//
// In Phase 8:
//   - Create an S3StorageAdapter that implements IStorageAdapter
//   - Replace placeholder psd_file_key references with real signed URLs
//   - No page-level download code should need to change
//
// export interface IStorageAdapter {
//   getDownloadUrl(fileKey: string): Promise<string>;
//   getPreviewUrl(fileKey: string): Promise<string>;
// }
//
// export class S3StorageAdapter implements IStorageAdapter {
//   async getDownloadUrl(fileKey) { ... }
//   async getPreviewUrl(fileKey) { ... }
// }
