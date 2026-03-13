import type { Metadata } from "next";
import { Suspense } from "react";
import type { AssetCategory } from "@/types/asset";
import { assetService } from "@/lib/services/index";
import { LibraryFilters } from "@/components/members/library-filters";
import { MemberAssetCard } from "@/components/members/member-asset-card";

export const metadata: Metadata = {
  title: "Library",
};

interface LibraryPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { category, q } = await searchParams;

  const assets = await assetService.getLibrary({
    category: category as AssetCategory | undefined,
    search: q,
  });

  const totalCount = await assetService.getLibrary();

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
            Library
          </h1>
          <p className="mt-1 text-sm text-content-muted">
            {totalCount.length} assets across 12 categories
          </p>
        </div>

        {/* Filters — client component, drives URL params */}
        <Suspense>
          <LibraryFilters activeCategory={category} activeSearch={q} />
        </Suspense>

        {/* Results */}
        {assets.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {assets.map((asset) => (
              <MemberAssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-medium text-content-primary">No assets found</p>
            <p className="mt-2 text-sm text-content-muted">
              {category || q
                ? "Try clearing your filters."
                : "The library is empty."}
            </p>
          </div>
        )}

        {/* Results count when filtered */}
        {(category || q) && assets.length > 0 && (
          <p className="mt-8 text-center text-sm text-content-muted">
            Showing {assets.length} result{assets.length !== 1 ? "s" : ""}
            {category ? ` in ${category}` : ""}
            {q ? ` for "${q}"` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
