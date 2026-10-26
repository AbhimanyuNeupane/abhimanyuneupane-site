import { getPublishedPosts, getSettings } from "@/lib/data";
import { postPath, SITE_URL } from "@/lib/format";

export const revalidate = 300;

const x = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const [s, posts] = await Promise.all([getSettings(), getPublishedPosts()]);
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}${postPath(p)}`;
      return `<item><title>${x(p.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(p.published_at || p.created_at).toUTCString()}</pubDate>${p.category ? `<category>${x(p.category)}</category>` : ""}<description>${x(p.excerpt || "")}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${x(s.site_title)}</title><link>${SITE_URL}</link><description>${x(s.tagline)}</description><language>en-ca</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
