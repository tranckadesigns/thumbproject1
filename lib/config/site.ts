import { categoryNames } from "@/lib/config/categories";

export const siteConfig = {
  name: "PSDfuel",
  description:
    "PSDfuel — Premium layered PSD thumbnail templates for YouTube creators. Revenue overlays, subscriber milestones, challenge trackers, and more. Edit in 60 seconds. From $19/mo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://psdfuel.com",
  plans: {
    monthly: {
      id: "monthly",
      label: "Monthly",
      price: 19,
      interval: "month" as const,
    },
    yearly: {
      id: "yearly",
      label: "Yearly",
      price: 149,
      interval: "year" as const,
      savings: "Save 35%",
    },
  },
  categories: categoryNames,
} as const;

export type SitePlanId = keyof typeof siteConfig.plans;
export type AssetCategoryName = string;
