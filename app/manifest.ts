import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AmritVella",
    short_name: "AmritVella",
    description: "Sikh discipline, healing, career, and self-mastery tracker.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fffaf0",
    theme_color: "#ff5a1f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
