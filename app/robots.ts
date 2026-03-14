import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/login", "/signup", "/privacy", "/terms", "/cookies"],
        disallow: ["/dashboard", "/library", "/asset/", "/account", "/favorites", "/api/", "/checkout/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
