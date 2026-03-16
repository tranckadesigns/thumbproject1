import Link from "next/link";
import {
  ChevronRight,
  Layers,
  RefreshCw,
  Download,
  Check,
  Shield,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { AssetCard } from "@/components/marketing/asset-overlays";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { PsdShowcase } from "@/components/marketing/psd-showcase";
import { FAQSection } from "@/components/marketing/faq";
import { CategoryIcon, CategoryIconStyles } from "@/components/marketing/category-icons";
import { StatsStrip } from "@/components/marketing/stats-strip"
import { CreatorsMarquee } from "@/components/marketing/creators-marquee"
;
import { CtrImpactSection } from "@/components/marketing/ctr-impact";
import { PricingPreviewSection } from "@/components/marketing/pricing-preview";
import { TimeReclaimedSection } from "@/components/marketing/time-reclaimed";
import { FileSpecsSection } from "@/components/marketing/file-specs";
import { EmailCaptureSection } from "@/components/marketing/email-capture";

import { NewThisMonthSection } from "@/components/marketing/new-this-month";
import { DemoWorkflowSection } from "@/components/marketing/demo-workflow";
import { cn } from "@/lib/utils/cn";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { redirect } from "next/navigation";
import { getLibraryStats } from "@/lib/services/stats-service";
import type { LibraryStats } from "@/lib/services/stats-service";
import type { Asset } from "@/types/asset";
import { assetService } from "@/lib/services";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { categoriesConfig } from "@/lib/config/categories";

// ─── YouTube Thumbnail Mockup ─────────────────────────────────────────────────

interface ThumbnailMockupProps {
  videoTitle: string;
  channel: string;
  views: string;
  gradient: string;
  accentColor: string;
}

function ThumbnailMockup({
  videoTitle,
  channel,
  views,
  gradient,
  accentColor,
}: ThumbnailMockupProps) {

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border transition-colors duration-300 hover:border-border-strong">
        <div className="absolute inset-0" style={{ background: gradient }} />
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${accentColor}50 0%, transparent 70%)` }}
        />
      </div>
      <div className="mt-3 flex items-start gap-2.5 px-0.5">
        <div
          className="h-8 w-8 flex-shrink-0 rounded-full border border-border"
          style={{ background: `linear-gradient(135deg, ${accentColor}25 0%, transparent 100%)` }}
        />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium leading-tight text-content-primary">
            {videoTitle}
          </p>
          <p className="mt-0.5 text-xs text-content-muted">
            {channel} · {views}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 1. Hero ──────────────────────────────────────────────────────────────────

function HeroSection({ stats, heroAssets, hasSubscription, isLoggedIn }: { stats: LibraryStats; heroAssets: Asset[]; hasSubscription: boolean; isLoggedIn: boolean }) {
  const includes = [
    "Fully layered .PSD files",
    "Commercial license included",
    "New assets added monthly",
    "Instant download, no queue",
  ];

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(201,169,110,0.12) 0%, transparent 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-5xl text-center">

          <Reveal>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-base-surface px-3.5 py-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                style={{ animation: "accentDot 3s ease-in-out infinite" }}
              />
              <span className="text-xs tracking-wide text-content-secondary">
                Members-only PSD library · Instant download
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tightest text-content-primary md:text-6xl lg:text-7xl">
              Premium PSD assets for{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #B8935A 0%, #C9A96E 30%, #DFC088 50%, #C9A96E 70%, #B8935A 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer 3s linear infinite",
                }}
              >
                YouTube thumbnails.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-content-secondary">
              The only library built specifically for YouTube thumbnails.
              Fully layered PSDs. Customize in under 60 seconds.
            </p>
          </Reveal>

          <Reveal delay={230}>
            <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {includes.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  <span className="text-xs text-content-muted">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton>
                <Link
                  id="hero-get-access"
                  href="/signup"
                  className={cn(buttonVariants({ size: "lg" }), "btn-shine active:scale-[0.97] transition-transform")}
                >
                  Get access
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/pricing"
                  className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "active:scale-[0.97] transition-transform")}
                >
                  View pricing
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <p className="mt-5 text-sm text-content-muted">
              Trusted by{" "}
              <span className="text-content-secondary">{stats.creatorCount.toLocaleString("en-US")}+</span> YouTube creators
              {" · "}
              <span className="text-content-secondary">{stats.assetCount}+</span> assets across{" "}
              <span className="text-content-secondary">{stats.categoryCount}</span> categories
            </p>
          </Reveal>

        </div>

        {/* Product preview grid */}
        <div className="mt-20">
          <Reveal>
            <p className="mb-6 text-center text-xs font-medium tracking-widest text-content-muted uppercase">
              From the library
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heroAssets.map((asset, i) => (
              <div
                key={asset.id}
                style={{
                  opacity: 0,
                  animation: `slideUp 0.55s cubic-bezier(0.16,1,0.3,1) ${500 + i * 90}ms forwards`,
                }}
              >
                <AssetCard
                  title={asset.title}
                  thumbnailUrl={asset.thumbnail_url || undefined}
                  slug={asset.slug}
                  hasSubscription={hasSubscription}
                />
              </div>
            ))}
          </div>
          <Reveal delay={400}>
            <div className="mt-10 flex justify-center">
              <a
                href={hasSubscription ? "/library" : isLoggedIn ? "/pricing" : "/signup"}
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-base-elevated px-6 py-3 text-sm font-medium text-content-primary transition-colors duration-200 hover:border-border-strong hover:bg-base-surface"
              >
                {hasSubscription ? "Explore the full library" : isLoggedIn ? "Upgrade to access the library" : "Get access to the full library"}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-content-muted">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Problem ───────────────────────────────────────────────────────────────

function ProblemSection() {
  const pains = [
    {
      title: "Building from scratch",
      desc: "Custom overlay graphics take 1–2 hours per video — time that compounds fast across a busy upload schedule.",
    },
    {
      title: "Generic template sites",
      desc: "Most template sites don't understand thumbnails. The results look like dashboard widgets, not authentic platform notifications.",
    },
    {
      title: "Hiring designers",
      desc: "Outsourcing every thumbnail isn't a system. It's expensive, slow, and creates a bottleneck on every video.",
    },
  ];

  return (
    <section className="border-t border-border bg-base-surface px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              The problem
            </p>
            <h2 className="text-3xl font-semibold leading-snug tracking-tight text-content-primary md:text-4xl">
              High-performing thumbnails take time
              <br className="hidden sm:block" /> most creators don&apos;t have.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-content-secondary">
              Revenue overlays, subscriber milestones, countdown timers — these
              details drive clicks. But making them look authentic is exactly
              where most creators get stuck.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {pains.map((pain, i) => (
            <Reveal key={pain.title} delay={i * 80}>
              <div className="flex flex-col gap-3 rounded-xl border border-error/10 bg-error/[0.03] p-6 transition-colors duration-200 hover:border-error/20">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-error/15 text-[10px] font-bold text-error">
                  ✕
                </div>
                <p className="text-sm font-semibold text-content-primary">{pain.title}</p>
                <p className="text-sm leading-relaxed text-content-secondary">{pain.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Solution ──────────────────────────────────────────────────────────────

// ─── 5. Comparison ────────────────────────────────────────────────────────────

const comparisonRows = [
  {
    label: "Designed for",
    theirs: "Generic UI kits adapted for thumbnails",
    ours: "Built from scratch for YouTube thumbnails",
  },
  {
    label: "File format",
    theirs: "Flat PNG or JPEG — nothing is editable",
    ours: "Fully layered PSD — every element on its own layer",
  },
  {
    label: "Edit speed",
    theirs: "Needs a designer, or hours on your own",
    ours: "Click a text layer, type your number. Under 60 seconds.",
  },
  {
    label: "Library updates",
    theirs: "One-time purchase — static, never grows",
    ours: "New assets every month, included automatically",
  },
  {
    label: "Exclusivity",
    theirs: "Sold to thousands — same look as everyone else",
    ours: "Members-only library, curated and controlled",
  },
  {
    label: "License",
    theirs: "Personal use only — no commercial rights",
    ours: "Full commercial license — clients and sponsors included",
  },
];

function ComparisonSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              Why creators switch
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              Not all thumbnail assets
              <br />
              are built the same.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-secondary">
              Most template packs are designed for aesthetics, not performance.
              PSDfuel is the only library built specifically around what actually
              drives clicks on YouTube.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="overflow-hidden rounded-2xl border border-border">
            {/* Column headers */}
            <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr] border-b border-border bg-base-surface">
              <div className="hidden sm:block px-6 py-4" />
              <div className="border-l border-border px-4 sm:px-6 py-4">
                <p className="text-xs font-medium text-content-muted">Other template packs</p>
              </div>
              <div className="border-l border-accent/20 bg-accent/[0.04] px-4 sm:px-6 py-4">
                <p className="text-xs font-semibold text-accent">PSDfuel</p>
              </div>
            </div>

            {/* Rows */}
            {comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "border-b border-border last:border-b-0",
                  i % 2 === 0 ? "bg-base" : "bg-base-surface"
                )}
              >
                <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr]">
                  {/* Attribute label — full width on mobile, first col on desktop */}
                  <div className="col-span-2 sm:col-span-1 flex items-center border-b border-border sm:border-b-0 px-4 sm:px-6 py-3 sm:py-4">
                    <p className="text-sm font-medium text-content-primary">{row.label}</p>
                  </div>

                  {/* Theirs */}
                  <div className="flex items-start gap-2 border-l border-border px-4 sm:px-6 py-3 sm:py-4">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-error/10 text-[9px] font-bold text-error">
                      ✕
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-content-muted">{row.theirs}</p>
                  </div>

                  {/* Ours */}
                  <div className="flex items-start gap-2 border-l border-accent/20 bg-accent/[0.04] px-4 sm:px-6 py-3 sm:py-4">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-[9px] font-bold text-accent">
                      ✓
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-content-secondary">{row.ours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "active:scale-[0.97] transition-transform"
              )}
            >
              Start with PSDfuel
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 6. Category Showcase ─────────────────────────────────────────────────────

function CategoryShowcaseSection({ stats }: { stats: LibraryStats }) {
  return (
    <section className="border-t border-border bg-base-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              Browse the library
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              {stats.categoryCount}+ categories.
              <br />
              Every thumbnail format covered.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-secondary">
              One subscription. Instant access to every category, every asset —
              with new additions every month.
            </p>
          </div>
        </Reveal>

        <CategoryIconStyles />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categoriesConfig.map(({ name, description }, i) => (
            <Reveal key={name} delay={i * 40}>
              <div className="group">
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#181818] transition-all duration-300 group-hover:border-accent/25 group-hover:shadow-elevated">
                  <CategoryIcon name={name} />
                </div>
                <div className="mt-2.5">
                  <p className="text-sm font-semibold text-content-primary">{name}</p>
                  <p className="mt-0.5 text-xs text-content-muted/70 leading-relaxed">{description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-content-muted">
            New assets added monthly across all categories · Included in every subscription
          </p>
        </Reveal>
      </div>
    </section>
  );
}


// ─── 7. Real Thumbnails ───────────────────────────────────────────────────────

const thumbnailData: ThumbnailMockupProps[] = [
  {
    videoTitle: "How I Made $24,180 From YouTube This Month (Full Revenue Breakdown)",
    channel: "MarkBuilds",
    views: "1.2M views",
    gradient: "linear-gradient(135deg, #180d00 0%, #2a1400 55%, #120a00 100%)",
    accentColor: "#FF8C00",
  },
  {
    videoTitle: "I Did This Every Day For 30 Days Straight — Here's What Happened",
    channel: "SophieDaily",
    views: "847K views",
    gradient: "linear-gradient(135deg, #000d18 0%, #001625 55%, #000a14 100%)",
    accentColor: "#FB923C",
  },
  {
    videoTitle: "I Tested Every YouTube Growth Strategy — Here's What Actually Works",
    channel: "JordanKodes",
    views: "2.4M views",
    gradient: "linear-gradient(135deg, #050d05 0%, #091509 55%, #040b04 100%)",
    accentColor: "#4ADE80",
  },
  {
    videoTitle: "LIVE in 24 Hours — Don't Miss This (Biggest Stream of the Year)",
    channel: "NinaLive",
    views: "430K views",
    gradient: "linear-gradient(135deg, #06040e 0%, #0a0820 55%, #060414 100%)",
    accentColor: "#818CF8",
  },
];

function RealThumbnailsSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              The library in action
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              Real thumbnails.
              <br />Real assets.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-content-secondary">
              Every asset is built to look platform-native — like a real YouTube
              notification, not a widget dropped from a dashboard.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {thumbnailData.map((t, i) => (
            <Reveal key={t.videoTitle} delay={i * 80}>
              <ThumbnailMockup {...t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 9. What's Included ──────────────────────────────────────────────────────

function WhatsIncludedSection() {
  const tiles = [
    {
      icon: Layers,
      label: "Fully layered PSD",
      desc: "Every element on its own named layer. Click, type, export. Done.",
    },
    {
      icon: RefreshCw,
      label: "New assets monthly",
      desc: "The library grows every month. Everything added is yours automatically.",
    },
    {
      icon: Download,
      label: "Instant download",
      desc: "One click. No export queue, no credits. The file is yours immediately.",
    },
    {
      icon: Shield,
      label: "Commercial license",
      desc: "Use in your own videos, for clients, or any sponsored content.",
    },
  ];

  return (
    <section className="border-t border-border bg-base-surface px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              Your membership
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              One subscription. Full access.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-content-secondary">
              No per-asset fees, no credits, no hidden tiers. Subscribe once
              and every asset in the library — past and future — is yours.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ icon: Icon, label, desc }, i) => (
            <Reveal key={label} delay={i * 70}>
              <div className="group rounded-xl border border-border bg-base-elevated p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevated">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-base-surface transition-colors duration-300 group-hover:border-accent/30 group-hover:bg-accent/5">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <p className="mb-1.5 text-sm font-semibold text-content-primary">{label}</p>
                <p className="text-sm leading-relaxed text-content-secondary">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "active:scale-[0.97] transition-transform")}
            >
              Get access
            </Link>
            <Link
              href="/pricing"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "active:scale-[0.97] transition-transform")}
            >
              See pricing
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 9. CTA ──────────────────────────────────────────────────────────────────

function CtaSection({ creatorCount }: { creatorCount: number }) {
  return (
    <section className="relative overflow-hidden border-t border-border px-6 py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.03] blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="mb-5 text-xs font-medium tracking-widest text-content-muted uppercase">
            Ready to upgrade?
          </p>
          <h2 className="text-4xl font-semibold tracking-tightest text-content-primary md:text-5xl">
            Your thumbnails
            <br />
            deserve better.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-content-secondary">
            Join {creatorCount.toLocaleString("en-US")}+ YouTube creators using PSDfuel to build scroll-stopping
            thumbnails in minutes, not hours.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "xl" }), "active:scale-[0.97] transition-transform")}
            >
              Get access
            </Link>
            <Link
              href="/pricing"
              className={cn(buttonVariants({ variant: "outline", size: "xl" }), "active:scale-[0.97] transition-transform")}
            >
              See pricing
            </Link>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-sm text-content-muted">
              Monthly from $19 · Yearly from $149 · Cancel anytime
            </p>
            <p className="flex items-center gap-1.5 text-xs text-content-muted/60">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent/60">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              30-day money-back guarantee · Secured by Stripe
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  // Supabase sends ?code= to the site URL when the redirect URL isn't whitelisted.
  // Intercept it here and forward to the auth callback handler.
  if (params.code) redirect(`/auth/callback?code=${params.code}&next=/reset-password`);

  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sub = user ? await getSubscription() : null;
  const hasSubscription = demoMode || sub?.status === "active" || sub?.status === "trialing";

  const [stats, allAssets, recentAssets] = await Promise.all([
    getLibraryStats(),
    assetService.getLibrary(),
    assetService.getRecent(4),
  ]);

  // Pick one asset per category for hero variety, up to 6
  const seen = new Set<string>();
  const heroAssets: Asset[] = [];
  for (const asset of allAssets) {
    if (heroAssets.length >= 6) break;
    if (!seen.has(asset.category)) {
      seen.add(asset.category);
      heroAssets.push(asset);
    }
  }
  // Fill remaining slots if fewer than 6 unique categories
  for (const asset of allAssets) {
    if (heroAssets.length >= 6) break;
    if (!heroAssets.includes(asset)) heroAssets.push(asset);
  }

  return (
    <>
      {/* 1 — Hook: headline + live preview */}
      <HeroSection stats={stats} heroAssets={heroAssets} hasSubscription={hasSubscription} isLoggedIn={!!user} />

      {/* 2 — Quick credibility numbers */}
      <StatsStrip assetCount={stats.assetCount} categoryCount={stats.categoryCount} creatorCount={stats.creatorCount} />

      {/* 3 — Show the product in real context before explaining anything */}
      <RealThumbnailsSection />

      {/* 4 — Social proof: real creators use this */}
      <CreatorsMarquee creatorCount={stats.creatorCount} />

      {/* 5 — Show the full library breadth */}
      <CategoryShowcaseSection stats={stats} />

      {/* 6 — Freshness signal: active product, new assets this month */}
      <NewThisMonthSection assetCount={stats.assetCount} recentAssets={recentAssets} />

      {/* 7 — Now that they've seen it, the problem lands harder */}
      <ProblemSection />

      {/* 8 — Us vs them */}
      <ComparisonSection />

      {/* 9 — Interactive step-by-step demo */}
      <DemoWorkflowSection />

      {/* 10 — Make the time ROI tangible */}
      <TimeReclaimedSection />

      {/* 11 — Social proof: let real users close the deal */}
      <TestimonialsSection />

      {/* 12 — Why overlays drive clicks (visual proof) */}
      <CtrImpactSection />

      {/* 13 — Show the PSD quality up close */}
      <PsdShowcase />

      {/* 14 — File quality specs, build trust */}
      <FileSpecsSection />

      {/* 15 — Pre-pricing recap: what does the subscription include */}
      <WhatsIncludedSection />

      {/* 16 — Price (after trust is established) */}
      <PricingPreviewSection assetCount={stats.assetCount} categoryCount={stats.categoryCount} />

      {/* 18 — Handle last objections */}
      <FAQSection />

      {/* 19 — Lead capture for non-buyers (before final CTA) */}
      <EmailCaptureSection />

      {/* 20 — Close */}
      <CtaSection creatorCount={stats.creatorCount} />
    </>
  );
}
