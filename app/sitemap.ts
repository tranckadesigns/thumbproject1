import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { assetService } from "@/lib/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/pricing`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/signup`,    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
    { url: `${base}/login`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/privacy`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/cookies`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];

  const assets = await assetService.getLibrary();
  const assetPages: MetadataRoute.Sitemap = assets.map((asset) => ({
    url: `${base}/asset/${asset.slug}`,
    lastModified: new Date(asset.updated_at ?? asset.created_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...assetPages];
}
