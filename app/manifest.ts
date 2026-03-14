import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PSDfuel",
    short_name: "PSDfuel",
    description: "Premium editable PSD thumbnail assets for YouTube creators.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0F0F0F",
    theme_color: "#0F0F0F",
    icons: [
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
