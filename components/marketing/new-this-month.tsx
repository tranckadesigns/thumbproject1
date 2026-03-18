import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import type { Asset } from "@/types/asset";

function assetTag(asset: Asset): { label: string; style: string } {
  const created = new Date(asset.created_at).getTime();
  const updated = asset.updated_at ? new Date(asset.updated_at).getTime() : created;
  const isUpdated = updated - created > 24 * 60 * 60 * 1000;
  return isUpdated
    ? { label: "Updated", style: "rounded-full border border-blue-500/20 bg-black/60 px-2.5 py-1 text-[10px] font-semibold leading-none text-blue-400 backdrop-blur-sm" }
    : { label: "New",     style: "rounded-full border border-emerald-500/25 bg-black/60 px-2.5 py-1 text-[10px] font-semibold leading-none text-emerald-400 backdrop-blur-sm" };
}

function currentMonthLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function NewThisMonthSection({
  assetCount,
  recentAssets,
  thisMonthCount,
  isLoggedIn,
  hasSubscription,
}: {
  assetCount: number;
  recentAssets: Asset[];
  thisMonthCount: number;
  isLoggedIn: boolean;
  hasSubscription: boolean;
}) {
  if (recentAssets.length === 0) return null;

  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <p className="text-xs font-medium uppercase tracking-widest text-content-muted">
                  {currentMonthLabel()}
                </p>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent border border-accent/20">
                  Just added
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
                New this month.
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-content-secondary">
                The library grows every month. Every new asset is included
                automatically — no extra charge.
              </p>
            </div>

            {/* Month count stat */}
            <div className="shrink-0 rounded-xl border border-border bg-base-surface px-6 py-4 text-right">
              <p className="text-3xl font-semibold tracking-tight text-content-primary">
                {thisMonthCount}
                <span className="ml-1 text-accent">+</span>
              </p>
              <p className="mt-0.5 text-xs text-content-muted">
                assets added this month
              </p>
              <p className="mt-2 text-[11px] text-content-muted/60">
                {assetCount}+ total in library
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recentAssets.map((asset, i) => {
            const tag = assetTag(asset);
            const href = hasSubscription && asset.slug
              ? `/asset/${asset.slug}`
              : isLoggedIn
              ? "/pricing"
              : "/signup";
            return (
              <Reveal key={asset.id} delay={i * 70}>
                <Link href={href} className="group relative block overflow-hidden rounded-xl border border-border bg-base-elevated transition-all duration-300 hover:border-border-strong hover:shadow-elevated">
                  {/* Badge */}
                  <div className="absolute right-3 top-3 z-10">
                    <span className={tag.style}>{tag.label}</span>
                  </div>

                  {/* Preview area */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#181818]">
                    {asset.thumbnail_url ? (
                      <Image
                        src={asset.thumbnail_url}
                        alt={asset.title}
                        fill
                        className="object-contain p-4"
                        style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.6))" }}
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 p-4 flex flex-col justify-end gap-1.5 opacity-15">
                        <div className="h-2 w-3/4 rounded bg-white/20" />
                        <div className="h-1.5 w-1/2 rounded bg-white/15" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-sm font-semibold text-content-primary">{asset.title}</p>
                    <p className="mt-0.5 text-xs text-content-muted">{asset.category}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={320}>
          <p className="mt-8 text-center text-sm text-content-muted">
            New assets are added every month and available instantly to all subscribers.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
