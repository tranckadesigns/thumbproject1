export const siteConfig = {
  name: "Vaulted",
  description:
    "Premium editable PSD thumbnail assets for YouTube creators and designers.",
  url: "https://vaulted.io",
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
    "Commerce",
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
