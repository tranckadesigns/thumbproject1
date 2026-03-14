import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AssetForm } from "@/components/admin/asset-form";
import { assetService } from "@/lib/services/index";

export const metadata: Metadata = { title: "Admin — Edit Asset" };

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await assetService.getAssetById(id);
  if (!asset) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/assets"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-content-muted transition-colors hover:text-content-primary"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to assets
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">
          Edit — {asset.title}
        </h1>
        <p className="mt-1 text-sm text-content-muted">{asset.slug}</p>
      </div>

      <AssetForm asset={asset} />
    </div>
  );
}
