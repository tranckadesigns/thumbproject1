import type { Metadata } from "next";
import Link from "next/link";
import { Eye, EyeOff, Star, ExternalLink } from "lucide-react";
import { assetService } from "@/lib/services/index";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Admin — Assets" };

export default async function AdminAssetsPage() {
  const assets = await assetService.getAllAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-content-primary">Assets</h1>
          <p className="mt-1 text-sm text-content-muted">
            {assets.length} total · {assets.filter((a) => a.is_published).length} published
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-base-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-base-overlay">
              <th className="px-4 py-3 text-left text-xs font-medium text-content-muted">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-content-muted">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-content-muted">Style</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-content-muted">Published</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-content-muted">Featured</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-content-muted">Size</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-content-muted">View</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => (
              <tr
                key={asset.id}
                className={cn(
                  "transition-colors hover:bg-base-overlay",
                  i < assets.length - 1 && "border-b border-border"
                )}
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-content-primary">{asset.title}</p>
                    <p className="text-xs text-content-muted">{asset.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-content-secondary">{asset.category}</td>
                <td className="px-4 py-3 text-content-secondary">{asset.style_type}</td>
                <td className="px-4 py-3 text-center">
                  {asset.is_published ? (
                    <Eye className="mx-auto h-4 w-4 text-emerald-400" />
                  ) : (
                    <EyeOff className="mx-auto h-4 w-4 text-content-muted" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {asset.is_featured ? (
                    <Star className="mx-auto h-4 w-4 fill-amber-400 text-amber-400" />
                  ) : (
                    <Star className="mx-auto h-4 w-4 text-content-muted/30" />
                  )}
                </td>
                <td className="px-4 py-3 text-right text-content-secondary">
                  {asset.file_size_mb} MB
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/asset/${asset.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-content-muted hover:text-content-primary transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
