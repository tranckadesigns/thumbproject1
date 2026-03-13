import { TrendingUp, DollarSign, ShoppingBag, BarChart2, Instagram, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ─── Platform Signal Overlays ─────────────────────────────────────────────────
// Each overlay is styled to look like an authentic platform notification
// as it would appear on a YouTube thumbnail.

export function YouTubeRevenueOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-lg bg-[#0f0f0f]/95 border border-white/10 p-3 shadow-overlay backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF0000]">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.84 4.84 0 0 1-1-.07z" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-white/60">YouTube Studio</span>
        </div>
        <p className="text-xs text-white/50 mb-1">Monthly revenue</p>
        <div className="flex items-end justify-between">
          <span className="text-xl font-bold tracking-tight text-white">$24,180</span>
          <span className="text-xs font-medium text-[#4ADE80] flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +34.2%
          </span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full bg-white/10">
          <div className="h-full w-[78%] rounded-full bg-[#FF0000]" />
        </div>
      </div>
    </div>
  );
}

export function StripePayoutOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-lg bg-[#0A2540]/95 border border-[#635BFF]/30 p-3 shadow-overlay backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#635BFF]">
            <DollarSign className="h-3 w-3 text-white" />
          </div>
          <span className="text-[10px] font-medium text-white/60">Stripe</span>
          <span className="ml-auto rounded-full bg-[#4ADE80]/20 px-1.5 py-0.5 text-[9px] font-medium text-[#4ADE80]">Paid</span>
        </div>
        <p className="text-[10px] text-white/40 mb-0.5">Payout to Chase ••4521</p>
        <p className="text-lg font-bold tracking-tight text-white">$8,420.00</p>
        <p className="mt-1.5 text-[9px] text-white/40">Arrives Oct 14 · 847 transactions</p>
      </div>
    </div>
  );
}

export function SubscriberMilestoneOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[200px] rounded-xl bg-[#0f0f0f]/95 border border-white/10 p-4 shadow-overlay backdrop-blur-sm text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0000] to-[#FF6B6B]">
          <Users className="h-5 w-5 text-white" />
        </div>
        <p className="text-[9px] font-medium text-white/50 uppercase tracking-wider mb-1">Milestone reached</p>
        <p className="text-2xl font-bold tracking-tighter text-white">100K</p>
        <p className="text-xs text-white/50">Subscribers</p>
        <div className="mt-3 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#FF0000]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShopifySalesOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-lg bg-[#1A1A2E]/95 border border-[#96BF48]/30 p-3 shadow-overlay backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#96BF48]">
            <ShoppingBag className="h-3 w-3 text-white" />
          </div>
          <span className="text-[10px] font-medium text-white/60">Shopify</span>
          <span className="ml-auto text-[9px] text-white/40">Today</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <p className="text-[9px] text-white/40">Revenue</p>
            <p className="text-sm font-bold text-white">$3,240</p>
          </div>
          <div>
            <p className="text-[9px] text-white/40">Orders</p>
            <p className="text-sm font-bold text-white">147</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-[#96BF48]" />
          <span className="text-[10px] text-[#96BF48] font-medium">+218% vs yesterday</span>
        </div>
      </div>
    </div>
  );
}

export function CTRAnalyticsOverlay() {
  const bars = [42, 58, 38, 71, 65, 80, 55];
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-lg bg-[#0f0f0f]/95 border border-white/10 p-3 shadow-overlay backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-white/60">Click-through rate</span>
          <BarChart2 className="h-3.5 w-3.5 text-white/30" />
        </div>
        <div className="flex items-end justify-between mb-1">
          <span className="text-xl font-bold tracking-tight text-white">8.4%</span>
          <span className="text-[10px] text-[#4ADE80] font-medium">+2.1%</span>
        </div>
        <div className="flex items-end gap-0.5 h-10 mt-2">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                backgroundColor: i === 5 ? "#C9A96E" : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
        <p className="mt-1.5 text-[9px] text-white/30">Last 7 days · 48K impressions</p>
      </div>
    </div>
  );
}

export function InstagramAlertOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-xl bg-[#0f0f0f]/95 border border-white/10 p-3 shadow-overlay backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]">
            <Instagram className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-white">New followers</p>
            <p className="text-[9px] text-white/40">Instagram</p>
          </div>
          <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#FD1D1D] text-[9px] font-bold text-white">
            +
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">2,847</span>
          <span className="mb-1 text-xs text-[#4ADE80]">today</span>
        </div>
        <div className="mt-2 flex -space-x-1.5">
          {["#E879F9", "#818CF8", "#FB923C", "#34D399", "#60A5FA"].map((c, i) => (
            <div
              key={i}
              className="h-5 w-5 rounded-full border-2 border-[#0f0f0f]"
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0f0f0f] bg-white/10 text-[8px] text-white/60">
            +
          </div>
        </div>
      </div>
    </div>
  );
}

export function GrowthChartOverlay() {
  const points = [15, 22, 18, 35, 28, 45, 38, 62, 55, 88];
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-lg bg-[#0a0a0a]/95 border border-white/10 p-3 shadow-overlay backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-white/60">Channel growth</span>
          <span className="rounded-full bg-[#4ADE80]/20 px-1.5 py-0.5 text-[9px] font-medium text-[#4ADE80]">
            Viral
          </span>
        </div>
        <div className="flex items-end gap-1.5 mb-2">
          <span className="text-xl font-bold tracking-tight text-white">+842%</span>
          <span className="mb-0.5 text-xs text-[#4ADE80]">this week</span>
        </div>
        <div className="flex items-end gap-0.5 h-10">
          {points.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                backgroundColor: i >= 7 ? "#4ADE80" : "rgba(74,222,128,0.25)",
              }}
            />
          ))}
        </div>
        <p className="mt-1.5 text-[9px] text-white/30">Views · Last 10 days</p>
      </div>
    </div>
  );
}

export function AlertBannerOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-xl bg-[#1a0a00]/95 border border-[#FBBF24]/30 p-4 shadow-overlay backdrop-blur-sm">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="h-2 w-2 rounded-full bg-[#FBBF24]" style={{ animation: "pulse 1.5s infinite" }} />
          <span className="text-[9px] font-semibold tracking-widest text-[#FBBF24] uppercase">Live alert</span>
        </div>
        <p className="text-sm font-bold text-white leading-tight mb-1">Video going viral</p>
        <p className="text-[10px] text-white/50 mb-3">+48,240 views in the last hour</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-white/10">
            <div className="h-full w-[82%] rounded-full bg-[#FBBF24]" />
          </div>
          <span className="text-[9px] text-[#FBBF24] font-medium">82%</span>
        </div>
      </div>
    </div>
  );
}

export function BestWorstOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] overflow-hidden rounded-lg shadow-overlay">
        <div className="grid grid-cols-2">
          <div className="bg-[#081808]/95 border border-[#4ADE80]/20 p-3 backdrop-blur-sm">
            <p className="text-[9px] font-bold tracking-widest text-[#4ADE80] uppercase mb-2">Best</p>
            <p className="text-lg font-bold text-white">$24,180</p>
            <p className="text-[9px] text-white/40 mt-0.5 mb-2">Revenue</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5 text-[#4ADE80]" />
              <span className="text-[9px] font-medium text-[#4ADE80]">+312%</span>
            </div>
          </div>
          <div className="bg-[#1a0808]/95 border border-[#F87171]/20 p-3 backdrop-blur-sm">
            <p className="text-[9px] font-bold tracking-widest text-[#F87171] uppercase mb-2">Worst</p>
            <p className="text-lg font-bold text-white/60">$2,140</p>
            <p className="text-[9px] text-white/40 mt-0.5 mb-2">Revenue</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5 text-[#F87171] rotate-180" />
              <span className="text-[9px] font-medium text-[#F87171]">-78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RatingStarsOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[200px] rounded-xl bg-[#0f0f0f]/95 border border-white/10 p-4 shadow-overlay backdrop-blur-sm text-center">
        <p className="text-[9px] font-medium tracking-widest text-white/40 uppercase mb-2">Overall rating</p>
        <div className="text-3xl font-bold tracking-tighter text-white mb-0.5">9.4</div>
        <p className="text-[10px] text-white/40 mb-2.5">out of 10</p>
        <div className="flex items-center justify-center gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} viewBox="0 0 12 12" className="h-3.5 w-3.5 fill-[#FBBF24]">
              <path d="M6 0l1.5 4H12l-3.7 2.7 1.4 4.3L6 8.4l-3.7 2.6 1.4-4.3L0 4h4.5z" />
            </svg>
          ))}
        </div>
        <p className="text-[9px] text-white/30">2,847 reviews</p>
      </div>
    </div>
  );
}

export function CountdownTimerOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-xl bg-[#0a0a1a]/95 border border-[#818CF8]/30 p-4 shadow-overlay backdrop-blur-sm text-center">
        <p className="text-[9px] font-semibold tracking-widest text-[#818CF8] uppercase mb-3">Ends in</p>
        <div className="flex items-center justify-center gap-2">
          {[
            { val: "23", label: "HRS" },
            { val: "14", label: "MIN" },
            { val: "08", label: "SEC" },
          ].map(({ val, label }, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex h-10 w-12 items-center justify-center rounded-lg border border-[#818CF8]/20 bg-[#1a1a3a]">
                <span className="font-mono text-xl font-bold tracking-tighter text-white">{val}</span>
              </div>
              <span className="mt-1 text-[8px] tracking-widest text-white/30">{label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[9px] text-white/40">Limited time only</p>
      </div>
    </div>
  );
}

export function ChallengeProgressOverlay() {
  const days = 22;
  const total = 30;
  const pct = Math.round((days / total) * 100);
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-xl bg-[#0f0f0f]/95 border border-white/10 p-3.5 shadow-overlay backdrop-blur-sm">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-sm">🔥</span>
          <span className="text-[10px] font-semibold text-white/60">30-Day Challenge</span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-2xl font-bold tracking-tight text-white">Day {days}</span>
            <span className="text-sm text-white/40"> / {total}</span>
          </div>
          <span className="text-xs font-semibold text-[#FB923C]">{pct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #FB923C, #FBBF24)",
            }}
          />
        </div>
        <p className="mt-2 text-[9px] text-white/30">8 days remaining · Keep going</p>
      </div>
    </div>
  );
}

export function PollResultOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-xl bg-[#0f0f0f]/95 border border-white/10 p-3.5 shadow-overlay backdrop-blur-sm">
        <p className="text-[9px] font-semibold tracking-widest text-white/40 uppercase mb-2">Poll results</p>
        <p className="text-xs font-medium text-white mb-3">Which strategy worked best?</p>
        {[
          { label: "Shorts first", pct: 78, color: "#C9A96E" },
          { label: "Long-form first", pct: 22, color: "rgba(255,255,255,0.15)" },
        ].map(({ label, pct, color }) => (
          <div key={label} className="mb-2">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-white/60">{label}</span>
              <span className="text-[10px] font-semibold text-white">{pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
        <p className="mt-1 text-[9px] text-white/30">14,820 votes</p>
      </div>
    </div>
  );
}

export function ReactionBubbleOverlay() {
  const reactions = [
    { emoji: "🔥", count: "2.4K" },
    { emoji: "😂", count: "1.1K" },
    { emoji: "💀", count: "847" },
    { emoji: "🤯", count: "634" },
    { emoji: "❤️", count: "521" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] rounded-xl bg-[#0f0f0f]/95 border border-white/10 p-3 shadow-overlay backdrop-blur-sm">
        <p className="text-[9px] font-medium text-white/40 mb-2.5">Top reactions · 5,506 total</p>
        <div className="flex flex-wrap gap-1.5">
          {reactions.map(({ emoji, count }) => (
            <div
              key={emoji}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1"
            >
              <span className="text-xs">{emoji}</span>
              <span className="text-[10px] font-medium text-white/60">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BeforeAfterOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-[220px] overflow-hidden rounded-lg border border-white/10 shadow-overlay">
        <div className="grid grid-cols-2 divide-x divide-white/10">
          <div className="bg-[#1a1a1a]/95 p-3 backdrop-blur-sm">
            <p className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-2">Before</p>
            <p className="text-xl font-bold text-white/50">3.2%</p>
            <p className="text-[9px] text-white/30 mt-0.5">CTR</p>
            <p className="mt-2 text-xs font-semibold text-[#F87171]">$840/mo</p>
          </div>
          <div className="bg-[#081808]/95 p-3 backdrop-blur-sm">
            <p className="text-[9px] font-bold tracking-widest text-[#4ADE80] uppercase mb-2">After</p>
            <p className="text-xl font-bold text-white">8.9%</p>
            <p className="text-[9px] text-white/30 mt-0.5">CTR</p>
            <p className="mt-2 text-xs font-semibold text-[#4ADE80]">$24,180/mo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Asset Card with Members Only hover ──────────────────────────────────────

export type OverlayType =
  | "revenue"
  | "payout"
  | "milestone"
  | "shopify"
  | "ctr"
  | "instagram"
  | "growth"
  | "alert"
  | "bestworst"
  | "rating"
  | "countdown"
  | "challenge"
  | "poll"
  | "reaction"
  | "beforeafter";

const overlayMap: Record<OverlayType, () => React.ReactElement> = {
  revenue: YouTubeRevenueOverlay,
  payout: StripePayoutOverlay,
  milestone: SubscriberMilestoneOverlay,
  shopify: ShopifySalesOverlay,
  ctr: CTRAnalyticsOverlay,
  instagram: InstagramAlertOverlay,
  growth: GrowthChartOverlay,
  alert: AlertBannerOverlay,
  bestworst: BestWorstOverlay,
  rating: RatingStarsOverlay,
  countdown: CountdownTimerOverlay,
  challenge: ChallengeProgressOverlay,
  poll: PollResultOverlay,
  reaction: ReactionBubbleOverlay,
  beforeafter: BeforeAfterOverlay,
};

const overlayLabels: Record<OverlayType, string> = {
  revenue: "Revenue",
  payout: "Commerce",
  milestone: "Subscribers",
  shopify: "Commerce",
  ctr: "Analytics",
  instagram: "Social",
  growth: "Growth",
  alert: "Alerts",
  bestworst: "Comparisons",
  rating: "Ratings",
  countdown: "Timers",
  challenge: "Challenges",
  poll: "Reactions",
  reaction: "Reactions",
  beforeafter: "Comparisons",
};

const overlayColors: Record<OverlayType, string> = {
  revenue: "bg-red-500/15 text-red-400",
  payout: "bg-indigo-500/15 text-indigo-400",
  milestone: "bg-red-500/15 text-red-400",
  shopify: "bg-lime-500/15 text-lime-400",
  ctr: "bg-amber-500/15 text-amber-400",
  instagram: "bg-purple-500/15 text-purple-400",
  growth: "bg-emerald-500/15 text-emerald-400",
  alert: "bg-yellow-500/15 text-yellow-400",
  bestworst: "bg-sky-500/15 text-sky-400",
  rating: "bg-amber-500/15 text-amber-400",
  countdown: "bg-violet-500/15 text-violet-400",
  challenge: "bg-orange-500/15 text-orange-400",
  poll: "bg-pink-500/15 text-pink-400",
  reaction: "bg-rose-500/15 text-rose-400",
  beforeafter: "bg-teal-500/15 text-teal-400",
};

interface AssetCardProps {
  overlayType: OverlayType;
  title: string;
  className?: string;
}

export function AssetCard({ overlayType, title, className }: AssetCardProps) {
  const OverlayComponent = overlayMap[overlayType];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-base-elevated aspect-[16/10] transition-colors duration-200 hover:border-border-strong",
        className
      )}
    >
      {/* Thumbnail background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#1a1a1a]" />

      {/* Subtle texture lines suggesting thumbnail content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end gap-1.5 opacity-20">
        <div className="h-2 w-3/4 rounded bg-white/20" />
        <div className="h-1.5 w-1/2 rounded bg-white/15" />
      </div>

      {/* Platform signal overlay */}
      <OverlayComponent />

      {/* Category badge */}
      <div className="absolute top-2.5 left-2.5">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            overlayColors[overlayType]
          )}
        >
          {overlayLabels[overlayType]}
        </span>
      </div>

      {/* Members only lock overlay — revealed on hover */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-base/85 opacity-0 backdrop-blur-[6px] transition-opacity duration-200 group-hover:opacity-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
          <span className="text-lg">🔒</span>
        </div>
        <p className="text-sm font-semibold text-content-primary">Members only</p>
        <p className="text-xs text-content-muted">Subscribe to download</p>
      </div>

      {/* Bottom meta bar */}
      <div className="absolute bottom-0 inset-x-0 border-t border-white/5 bg-black/50 px-3 py-2 backdrop-blur-sm">
        <p className="truncate text-xs font-medium text-white/60">{title}</p>
      </div>
    </div>
  );
}
