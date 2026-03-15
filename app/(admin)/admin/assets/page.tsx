import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { assetService } from "@/lib/services/index";
import { AssetsTable } from "@/components/admin/assets-table";

export const metadata: Metadata = { title: "Admin — Assets" };

export default async function AdminAssetsPage() {
  const assets = await assetService.getAllAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-content-primary">
            Assets
          </h1>
          <p className="mt-1 text-sm text-content-muted">
            {assets.length} total · {assets.filter((a) => a.is_published).length} published
          </p>
        </div>
        <Link
          href="/admin/assets/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New asset
        </Link>
      </div>

      {assets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center">
          <p className="text-sm text-content-muted">No assets yet.</p>
          <Link
            href="/admin/assets/new"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Create your first asset
          </Link>
        </div>
      ) : (
        <AssetsTable assets={assets} />
      )}
    </div>
  );
}
