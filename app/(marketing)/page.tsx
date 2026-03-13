import Link from "next/link";
import {
  ChevronRight,
  Layers,
  Zap,
  RefreshCw,
  Download,
  Pencil,
  Search,
  DollarSign,
  Users,
  BarChart2,
  Flame,
  GitCompare,
  Star,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import {
  AssetCard,
  YouTubeRevenueOverlay,
  ChallengeProgressOverlay,
  BestWorstOverlay,
  CountdownTimerOverlay,
} from "@/components/marketing/asset-overlays";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { PsdShowcase } from "@/components/marketing/psd-showcase";
import { cn } from "@/lib/utils/cn";

// ─── YouTube Thumbnail Mockup ─────────────────────────────────────────────────

interface ThumbnailMockupProps {
  thumbnailTitle: string;
  videoTitle: string;
  channel: string;
  views: string;
  gradient: string;
  accentColor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OverlayComponent: React.ComponentType<any>;
  assetName: string;
  overlayPos?: "right" | "center";
}

function ThumbnailMockup({
  thumbnailTitle,
  videoTitle,
  channel,
  views,
  gradient,
  accentColor,
  OverlayComponent,
  assetName,
  overlayPos = "right",
}: ThumbnailMockupProps) {
  const posClass =
    overlayPos === "right"
      ? "absolute right-3 top-[8%] h-[84%] w-[46%]"
      : "absolute left-1/2 top-1/2 h-[72%] w-[54%] -translate-x-1/2 -translate-y-1/2";

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border transition-colors duration-300 hover:border-border-strong">
        <div className="absolute inset-0" style={{ background: gradient }} />
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${accentColor}50 0%, transparent 70%)`,
          }}
        />
        <div className="absolute left-4 top-4 max-w-[48%]">
          <p
            className="font-black text-xl leading-[1.18] text-white uppercase"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)" }}
          >
            {thumbnailTitle}
          </p>
        </div>
        <div className={posClass}>
          <div className="relative h-full w-full">
            <OverlayComponent />
          </div>
        </div>
        <div className="absolute bottom-2.5 left-3">
          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-black/75 px-2.5 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            <span className="text-[9px] text-white/55">Asset used:</span>
            <span className="text-[9px] font-semibold text-accent">{assetName}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2.5 px-0.5">
        <div
          className="h-8 w-8 flex-shrink-0 rounded-full border border-border"
          style={{
            background: `linear-gradient(135deg, ${accentColor}25 0%, transparent 100%)`,
          }}
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

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-24">
      {/* Animated background glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] animate-glow-pulse"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Headline block */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-base-surface px-3.5 py-1.5">
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
              Premium PSD assets
              <br />
              for{" "}
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
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-content-secondary">
              A curated library of fully layered thumbnail graphics — revenue
              alerts, subscriber milestones, before/after comparisons, countdown
              timers, and more. Edit the numbers in Photoshop. Export. Done.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "active:scale-[0.97] transition-transform"
                )}
              >
                Get access
              </Link>
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "active:scale-[0.97] transition-transform"
                )}
              >
                View pricing
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                "Fully layered PSD",
                "Edit in under 60 seconds",
                "12 categories",
                "New assets monthly",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-content-muted">
                  <span className="text-accent">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Product preview — visible immediately on scroll */}
        <div className="mt-16">
          <Reveal delay={360}>
            <p className="mb-6 text-center text-[11px] font-medium tracking-widest text-content-muted uppercase">
              From the library
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { type: "revenue" as const, title: "YouTube Revenue Notification" },
              { type: "milestone" as const, title: "Subscriber Milestone Popup" },
              { type: "bestworst" as const, title: "Best vs Worst Comparison" },
              { type: "countdown" as const, title: "Countdown Timer Overlay" },
              { type: "challenge" as const, title: "Challenge Progress Bar" },
              { type: "reaction" as const, title: "Reaction Bubbles" },
            ].map(({ type, title }, i) => (
              <Reveal key={type} delay={360 + i * 60}>
                <AssetCard overlayType={type} title={title} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. Problem ───────────────────────────────────────────────────────────────

function ProblemSection() {
  const pains = [
    "Building custom overlay graphics from scratch takes 1–2 hours per video",
    "Generic template sites don't look like real platform notifications",
    "Hiring a designer for every thumbnail isn't scalable",
  ];

  return (
    <section className="border-t border-border bg-base-surface px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
                The old way
              </p>
              <h2 className="text-3xl font-semibold leading-snug tracking-tight text-content-primary">
                Thumbnail overlays take hours you don&apos;t have.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-content-secondary">
                High-performing thumbnails use overlays that look like real
                platform data — revenue alerts, subscriber counts, payout
                notifications. Most creators either skip them entirely or settle
                for templates that feel nothing like the real thing.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ul className="space-y-3">
              {pains.map((pain, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border bg-base-elevated p-4 transition-colors duration-200 hover:border-border-strong"
                >
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-error/15 text-[10px] font-bold text-error">
                    ✕
                  </div>
                  <p className="text-sm leading-relaxed text-content-secondary">{pain}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Solution ──────────────────────────────────────────────────────────────

function SolutionSection() {
  const attributes = [
    {
      icon: Layers,
      title: "Fully layered PSD",
      desc: "Every element on its own named layer. Text, backgrounds, effects, icons — all independently editable. Nothing merged or flattened.",
    },
    {
      icon: Zap,
      title: "Swap any number",
      desc: "Click the text layer, type your value, export. Most assets take under 60 seconds to customize for your video.",
    },
    {
      icon: Star,
      title: "Built for thumbnails",
      desc: "Not UI components repurposed as overlays. Designed specifically to sit inside a YouTube thumbnail and look authentic.",
    },
    {
      icon: RefreshCw,
      title: "New assets monthly",
      desc: "The library grows every month across all 12 categories. Your subscription includes everything added, automatically.",
    },
  ];

  return (
    <section className="border-t border-border px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              What Vaulted provides
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              A curated library of premium
              <br />
              thumbnail PSD assets.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {attributes.map((attr, i) => {
            const Icon = attr.icon;
            return (
              <Reveal key={attr.title} delay={i * 80}>
                <div className="group flex flex-col gap-4 rounded-xl border border-border bg-base-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-base-elevated hover:shadow-elevated">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-base-elevated transition-colors duration-300 group-hover:border-accent/30">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="mb-1.5 text-sm font-semibold text-content-primary">
                      {attr.title}
                    </p>
                    <p className="text-sm leading-relaxed text-content-secondary">
                      {attr.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Real Thumbnails ───────────────────────────────────────────────────────

const thumbnailData: ThumbnailMockupProps[] = [
  {
    thumbnailTitle: "HOW I MADE $24K THIS MONTH",
    videoTitle: "How I Made $24,180 From YouTube This Month (Full Revenue Breakdown)",
    channel: "MarkBuilds",
    views: "1.2M views",
    gradient: "linear-gradient(135deg, #180d00 0%, #2a1400 55%, #120a00 100%)",
    accentColor: "#FF8C00",
    OverlayComponent: YouTubeRevenueOverlay,
    assetName: "Revenue Alert",
    overlayPos: "right",
  },
  {
    thumbnailTitle: "30-DAY CHALLENGE: Day 22",
    videoTitle: "I Did This Every Day For 30 Days Straight — Here's What Happened",
    channel: "SophieDaily",
    views: "847K views",
    gradient: "linear-gradient(135deg, #000d18 0%, #001625 55%, #000a14 100%)",
    accentColor: "#FB923C",
    OverlayComponent: ChallengeProgressOverlay,
    assetName: "Challenge Progress",
    overlayPos: "right",
  },
  {
    thumbnailTitle: "BEST vs WORST Strategies",
    videoTitle: "I Tested Every YouTube Growth Strategy — Here's What Actually Works",
    channel: "JordanKodes",
    views: "2.4M views",
    gradient: "linear-gradient(135deg, #050d05 0%, #091509 55%, #040b04 100%)",
    accentColor: "#4ADE80",
    OverlayComponent: BestWorstOverlay,
    assetName: "Comparison Frame",
    overlayPos: "center",
  },
  {
    thumbnailTitle: "Going LIVE In...",
    videoTitle: "LIVE in 24 Hours — Don't Miss This (Biggest Stream of the Year)",
    channel: "NinaLive",
    views: "430K views",
    gradient: "linear-gradient(135deg, #06040e 0%, #0a0820 55%, #060414 100%)",
    accentColor: "#818CF8",
    OverlayComponent: CountdownTimerOverlay,
    assetName: "Countdown Timer",
    overlayPos: "center",
  },
];

function RealThumbnailsSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              In a real thumbnail
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              See exactly how they&apos;re used.
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-content-secondary">
              Each asset sits naturally inside a YouTube thumbnail — not like
              a widget dropped from a dashboard.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {thumbnailData.map((t, i) => (
            <Reveal key={t.assetName} delay={i * 80}>
              <ThumbnailMockup {...t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. Thumbnail Use Cases ───────────────────────────────────────────────────

const useCases = [
  {
    type: "Revenue thumbnails",
    icon: DollarSign,
    accent: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/15",
    description: "Show earnings, payouts, and financial milestones that stop the scroll.",
    examples: [
      '"How I Made $24K This Month"',
      '"My YouTube Revenue Revealed"',
      '"First $1K Day on Shopify"',
    ],
  },
  {
    type: "Challenge thumbnails",
    icon: Flame,
    accent: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/15",
    description: "Track day-by-day progress through multi-week experiments and streaks.",
    examples: [
      '"30-Day Workout (Day 22)"',
      '"I Ate One Meal A Day For A Month"',
      '"Week 6 of My $0 Business"',
    ],
  },
  {
    type: "Comparison thumbnails",
    icon: GitCompare,
    accent: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/15",
    description: "Create curiosity gaps with clear before/after or best/worst contrasts.",
    examples: [
      '"Best vs Worst YouTube Advice"',
      '"Before & After: My Setup"',
      '"Old Strategy vs New Results"',
    ],
  },
  {
    type: "Milestone thumbnails",
    icon: Users,
    accent: "text-red-400",
    bg: "bg-red-500/10 border-red-500/15",
    description: "Celebrate subscriber counts, view records, and channel achievements.",
    examples: [
      '"I Hit 100K Subscribers!"',
      '"First 1 Million Views"',
      '"My Channel Just Hit 500K"',
    ],
  },
  {
    type: "Analytics thumbnails",
    icon: BarChart2,
    accent: "text-accent",
    bg: "bg-accent/10 border-accent/15",
    description: "Show real CTR, watch time, and performance data that builds credibility.",
    examples: [
      '"My CTR Went From 2% to 9%"',
      '"How I Got 1M Views in 30 Days"',
      '"Real Channel Stats Exposed"',
    ],
  },
  {
    type: "Reaction thumbnails",
    icon: MessageCircle,
    accent: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/15",
    description: "Display poll results, community reactions, and engagement stats.",
    examples: [
      '"78% of You Got This Wrong"',
      '"My Community Voted and..."',
      '"100K People Reacted To This"',
    ],
  },
];

function ThumbnailUseCasesSection() {
  return (
    <section className="border-t border-border bg-base-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              What you can build
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              Every type of thumbnail. Covered.
            </h2>
            <p className="mt-4 text-content-secondary">
              Six video formats. Twelve asset categories. All the elements you need.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <Reveal key={uc.type} delay={i * 60}>
                <div className="group flex flex-col gap-4 rounded-xl border border-border bg-base-elevated p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevated">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border",
                        uc.bg
                      )}
                    >
                      <Icon className={cn("h-4 w-4", uc.accent)} />
                    </div>
                    <p className="text-sm font-semibold text-content-primary">{uc.type}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-content-secondary">{uc.description}</p>
                  <ul className="space-y-1.5">
                    {uc.examples.map((ex) => (
                      <li key={ex} className="flex items-baseline gap-2">
                        <span className="mt-[3px] h-1 w-1 flex-shrink-0 rounded-full bg-content-muted" />
                        <span className="text-xs text-content-muted">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 6. How It Works ─────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Browse the library",
      description:
        "Filter by category, preview every asset in detail, and find the exact thumbnail graphic you need.",
    },
    {
      number: "02",
      icon: Download,
      title: "Download the PSD",
      description:
        "One click to download the fully layered file. No credits, no limits — yours instantly.",
    },
    {
      number: "03",
      icon: Pencil,
      title: "Edit and export",
      description:
        "Open in Photoshop, click the number layer, type your value, export. Done in under 60 seconds.",
    },
  ];

  return (
    <section className="border-t border-border px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              How it works
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              Three steps. Done.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.number} delay={i * 100}>
                <div className="group flex flex-col gap-6 rounded-xl border border-border bg-base-surface p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevated">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-base-elevated transition-colors duration-300 group-hover:border-accent/30">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <span className="select-none text-3xl font-bold tracking-tightest text-border-strong">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-content-primary">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-content-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 8. Features ──────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: Layers,
      title: "Fully layered PSD files",
      description:
        "Every element on its own layer — text, backgrounds, icons, glows, effects. Open in Photoshop and change anything in under a minute.",
    },
    {
      icon: ShieldCheck,
      title: "Curated, not crowded",
      description:
        "Every asset passes a quality standard before it ships. No filler, no noise, no half-finished work. Only premium graphics worth using.",
    },
    {
      icon: Sparkles,
      title: "New assets every month",
      description:
        "The library grows with new additions each month. Your membership keeps pace — you'll always have fresh material.",
    },
  ];

  return (
    <section className="border-t border-border bg-base-surface px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              What you get
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              Quality without compromise.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 100}>
                <div className="group flex flex-col gap-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-base-elevated transition-all duration-300 group-hover:border-accent/30">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-content-primary">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-content-secondary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 9. CTA ──────────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="border-t border-border px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tightest text-content-primary md:text-4xl">
            Stop starting from scratch.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-content-secondary">
            Join Vaulted and get instant access to a growing library of premium
            PSD thumbnail assets across 12 categories.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "xl" }),
                "active:scale-[0.97] transition-transform"
              )}
            >
              Get access
            </Link>
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: "outline", size: "xl" }),
                "active:scale-[0.97] transition-transform"
              )}
            >
              See pricing
            </Link>
          </div>
          <p className="mt-5 text-sm text-content-muted">
            Monthly from $19 · Yearly from $149 · Cancel anytime
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <RealThumbnailsSection />
      <ThumbnailUseCasesSection />
      <HowItWorksSection />
      <PsdShowcase />
      <TestimonialsSection />
      <FeaturesSection />
      <CtaSection />
    </>
  );
}
