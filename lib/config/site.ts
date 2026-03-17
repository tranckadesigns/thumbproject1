import { categoryNames } from "@/lib/config/categories";

export const siteConfig = {
  name: "PSDfuel",
  description:
    "Premium PSD thumbnail assets for YouTube creators. Revenue cards, subscriber milestones, challenge trackers and more. Fully editable. From $19/mo.",
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
