import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AssetForm } from "@/components/admin/asset-form";

export const metadata: Metadata = { title: "Admin — New Asset" };

export default function NewAssetPage() {
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
          New asset
        </h1>
        <p className="mt-1 text-sm text-content-muted">
          Fill in the details, upload the files, then publish.
        </p>
      </div>

      <AssetForm />
    </div>
  );
}
