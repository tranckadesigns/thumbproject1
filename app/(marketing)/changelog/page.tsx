import type { Metadata } from "next";

export const metadata: Metadata = { title: "Changelog" };

interface ChangelogEntry {
  version: string;
  date: string;
  badge?: "new" | "update" | "fix";
  headline: string;
  items: string[];
}

const entries: ChangelogEntry[] = [
  {
    version: "v1.4",
    date: "March 2026",
    badge: "new",
    headline: "Reactions & Polls category",
    items: [
      "4 new assets: emoji reaction bubbles, poll bar, vote counter, community post overlay",
      "Improved layer naming conventions across all PSD files for faster navigation",
      "Added smart object support to Revenue Alert and Subscriber Milestone assets",
    ],
  },
  {
    version: "v1.3",
    date: "February 2026",
    badge: "new",
    headline: "Timers & Countdown category",
    items: [
      "3 new assets: live event timer, stream countdown, deadline clock",
      "All timer assets include editable digits as individual text layers",
      "Comparison Frame overlay now includes a third-state variant",
    ],
  },
  {
    version: "v1.2",
    date: "January 2026",
    badge: "update",
    headline: "Library improvements",
    items: [
      "Ratings category launched: star rating, score badge, review summary panel",
      "Redesigned member dashboard with improved search and category filtering",
      "Download history now shows all past downloads with re-download links",
      "Fixed: Revenue Alert PSD had locked adjustment layer — now editable",
    ],
  },
  {
    version: "v1.1",
    date: "December 2025",
    badge: "update",
    headline: "Platform stability + new assets",
    items: [
      "Challenge Progress Bar asset added to Challenges category",
      "Countdown Timer overlay redesigned with cleaner digit separation",
      "Improved mobile experience across library and account pages",
      "Fixed: subscription status not updating immediately after payment",
    ],
  },
  {
    version: "v1.0",
    date: "November 2025",
    badge: "new",
    headline: "PSDfuel launches",
    items: [
      "Launch with 12 categories and 40+ fully layered PSD assets",
      "Instant download, no export queue",
      "Commercial license included with every subscription",
      "Founding member pricing locked in for life",
    ],
  },
];

const badgeStyles = {
  new: "bg-accent/10 text-accent border border-accent/20",
  update: "bg-blue-500/10 text-blue-400 border border-blue-500/15",
  fix: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15",
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-content-muted">
        Product
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-content-primary">
        Changelog
      </h1>
      <p className="mt-3 text-sm text-content-muted">
        New assets, improvements, and fixes — in order.
      </p>

      <div className="mt-12 flex flex-col gap-12">
        {entries.map((entry) => (
          <div key={entry.version} className="relative pl-6">
            {/* Timeline line */}
            <div className="absolute left-0 top-1.5 flex flex-col items-center">
              <div className="h-2 w-2 rounded-full bg-accent/40" />
              <div className="mt-2 w-px flex-1 bg-border" style={{ minHeight: "calc(100% - 16px)" }} />
            </div>

            <div className="flex flex-wrap items-center gap-3 pb-1">
              <span className="text-sm font-semibold text-content-primary">
                {entry.version}
              </span>
              {entry.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeStyles[entry.badge]}`}
                >
                  {entry.badge}
                </span>
              )}
              <span className="text-xs text-content-muted">{entry.date}</span>
            </div>

            <p className="mt-1 text-base font-semibold text-content-primary">
              {entry.headline}
            </p>

            <ul className="mt-4 flex flex-col gap-2.5">
              {entry.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-content-muted/40" />
                  <span className="text-sm leading-relaxed text-content-secondary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-16 text-center text-xs text-content-muted">
        Subscribed members receive email updates when new assets are added.
      </p>
    </div>
  );
}
