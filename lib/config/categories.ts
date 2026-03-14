/**
 * Single source of truth for all PSDfuel categories.
 *
 * To ADD a category:
 *   1. Add an entry here (name + description)
 *   2. Add a matching icon case in components/marketing/category-icons.tsx
 *   3. Upload assets with that category name in the admin panel
 *
 * To REMOVE a category:
 *   1. Delete the entry here — it disappears everywhere automatically
 *   2. Optionally clean up the icon case in category-icons.tsx
 */

export interface CategoryConfig {
  name: string;
  description: string;
}

export const categoriesConfig: CategoryConfig[] = [
  { name: "Revenue",     description: "Earnings, payouts & income notifications" },
  { name: "Subscribers", description: "Milestone popups & live counters" },
  { name: "Growth",      description: "Views, charts & channel performance" },
  { name: "Alerts",      description: "Live alerts, breaking news & warnings" },
  { name: "Social",      description: "Instagram, Twitter & TikTok proof" },
  { name: "E-Commerce",  description: "Sales, products & ecommerce data" },
  { name: "Analytics",   description: "CTR, impressions & watch time" },
  { name: "Challenges",  description: "Progress bars, streaks & day trackers" },
  { name: "Comparisons", description: "Before/after & best vs worst frames" },
  { name: "Ratings",     description: "Stars, scores & review summaries" },
  { name: "Timers",      description: "Countdown clocks & live event timers" },
  { name: "Reactions",   description: "Polls, votes & emoji reactions" },
];

export const categoryNames = categoriesConfig.map((c) => c.name) as [string, ...string[]];
