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

export type StyleType = "Dark" | "Light" | "Minimal" | "Bold" | "Neon" | "Gradient";

export interface Asset {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  category: AssetCategory;
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
  updated_at?: string;
  download_count?: number;
}
