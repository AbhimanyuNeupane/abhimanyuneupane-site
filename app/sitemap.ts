import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data";
import { postPath, SITE_URL } from "@/lib/format";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.6 },
    ...posts.map((p) => ({ url: `${SITE_URL}${postPath(p)}`, lastModified: p.updated_at, priority: 0.7 })),
  ];
}
