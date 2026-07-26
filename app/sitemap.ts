import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getSiteUrl();

  return [
    {
      url: baseUrl.toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
