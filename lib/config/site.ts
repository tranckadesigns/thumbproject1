export const siteConfig = {
  name: "PSDfuel",
  description:
    "Premium editable PSD thumbnail assets for YouTube creators and designers.",
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
  categories: [
    "Revenue",
    "Subscribers",
    "Growth",
    "Alerts",
    "Social",
    "E-Commerce",
    "Analytics",
    "Challenges",
    "Comparisons",
    "Ratings",
    "Timers",
    "Reactions",
  ] as const,
} as const;

export type SitePlanId = keyof typeof siteConfig.plans;
export type AssetCategoryName = (typeof siteConfig.categories)[number];
