"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Star, ExternalLink, Pencil, Search, X } from "lucide-react";
import type { Asset } from "@/types/asset";
import { cn } from "@/lib/utils/cn";

interface AssetsTableProps {
  assets: Asset[];
}

export function AssetsTable({ assets }: AssetsTableProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? assets.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase()) ||
          a.slug.toLowerCase().includes(query.toLowerCase())
      )
    : assets;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-content-muted" />
        <input
          type="search"
          placeholder="Search by title, category or slug…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-base-elevated pl-9 pr-8 text-sm text-content-primary placeholder:text-content-muted focus:border-border-strong focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {query && (
        <p className="text-xs text-content-muted">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 text-center">
          <p className="text-sm text-content-muted">No assets match your search.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-base-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-base-overlay">
                <th className="px-4 py-3 text-left text-xs font-medium text-content-muted w-10" />
                <th className="px-4 py-3 text-left text-xs font-medium text-content-muted">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-content-muted">Category</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-content-muted">Published</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-content-muted">Featured</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-content-muted">↓</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-content-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset, i) => (
                <tr
                  key={asset.id}
                  className={cn(
                    "transition-colors hover:bg-base-overlay",
                    i < filtered.length - 1 && "border-b border-border"
                  )}
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-2">
                    <div className="relative h-8 w-12 overflow-hidden rounded border border-border bg-[#0f0f0f]">
                      {asset.thumbnail_url ? (
                        <Image
                          src={asset.thumbnail_url}
                          alt={asset.title}
                          fill
                          className="object-contain p-0.5"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full bg-base-elevated" />
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-content-primary">{asset.title}</p>
                      <p className="text-xs text-content-muted">{asset.slug}</p>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-content-secondary">{asset.category}</td>

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

                  <td className="px-4 py-3 text-right text-xs text-content-muted">
                    {(asset.download_count ?? 0) > 0
                      ? asset.download_count!.toLocaleString()
                      : "—"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/assets/${asset.id}/edit`}
                        className="inline-flex items-center gap-1 text-xs text-content-muted transition-colors hover:text-content-primary"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                      <Link
                        href={`/asset/${asset.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-content-muted transition-colors hover:text-content-primary"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
