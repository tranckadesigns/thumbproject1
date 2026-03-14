import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  return [
    { url: base,           lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/login`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/signup`,  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/cookies`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];
}
