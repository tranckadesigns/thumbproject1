import type { Metadata } from "next";
import Link from "next/link";
import { Layers, Star, Eye, EyeOff, FolderOpen, ArrowRight } from "lucide-react";
import { assetService } from "@/lib/services/index";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "Admin — Overview" };

export default async function AdminOverviewPage() {
  const allAssets = await assetService.getAllAdmin();
  const published = allAssets.filter((a) => a.is_published);
  const unpublished = allAssets.filter((a) => !a.is_published);
  const featured = allAssets.filter((a) => a.is_featured && a.is_published);

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const newThisMonth = published.filter(
    (a) => new Date(a.created_at).getTime() > thirtyDaysAgo
  ).length;

  // Assets per category
  const categoryCounts = siteConfig.categories.map((cat) => ({
    name: cat,
    count: published.filter((a) => a.category === cat).length,
  }));

  const stats = [
    { label: "Total assets",   value: allAssets.length,   icon: Layers,  color: "text-sky-400" },
    { label: "Published",      value: published.length,   icon: Eye,     color: "text-emerald-400" },
    { label: "Unpublished",    value: unpublished.length, icon: EyeOff,  color: "text-content-muted" },
    { label: "Featured",       value: featured.length,    icon: Star,    color: "text-amber-400" },
    { label: "Categories",     value: siteConfig.categories.length, icon: FolderOpen, color: "text-purple-400" },
    { label: "New this month", value: newThisMonth,        icon: Layers,  color: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">Overview</h1>
        <p className="mt-1 text-sm text-content-muted">Asset library at a glance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-border bg-base-surface p-4">
            <Icon className={`mb-3 h-4 w-4 ${color}`} />
            <p className="text-2xl font-semibold tracking-tight text-content-primary">{value}</p>
            <p className="mt-0.5 text-xs text-content-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-content-muted">
            By category
          </h2>
          <Link
            href="/admin/assets"
            className="flex items-center gap-1 text-xs text-content-muted hover:text-content-primary transition-colors"
          >
            Manage assets <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-base-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-base-overlay">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-content-muted">Category</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-content-muted">Published assets</th>
              </tr>
            </thead>
            <tbody>
              {categoryCounts.map(({ name, count }, i) => (
                <tr
                  key={name}
                  className={i < categoryCounts.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-4 py-3 text-content-secondary">{name}</td>
                  <td className="px-4 py-3 text-right font-medium text-content-primary">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
