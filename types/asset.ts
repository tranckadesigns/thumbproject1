export type AssetCategory =
  | "Revenue"
  | "Subscribers"
  | "Growth"
  | "Alerts"
  | "Social"
  | "E-Commerce"
  | "Analytics"
  | "Challenges"
  | "Comparisons"
  | "Ratings"
  | "Timers"
  | "Reactions";

export type PlatformType = "YouTube" | "General";

export type StyleType = "Dark" | "Light" | "Minimal" | "Bold" | "Clean";

export interface Asset {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  category: AssetCategory;
  platform_type: PlatformType;
  style_type: StyleType;
  thumbnail_url: string;
  preview_images: string[];
  psd_file_key: string;
  file_size_mb: number;
  version: string;
  is_featured: boolean;
  is_published: boolean;
  tags: string[];
  created_at: string;
}
