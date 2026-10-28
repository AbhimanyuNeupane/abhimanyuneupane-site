import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";
import type { Post } from "./types";
import { slugify } from "./slug";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://abhimanyuneupane.com").replace(/\/$/, "");
const TZ = "America/Toronto";

export { slugify };

function dateParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { y: get("year"), m: get("month"), d: get("day") };
}

/** Keeps the old WordPress permalink structure: /YYYY/MM/DD/slug */
export function postPath(p: Pick<Post, "slug" | "published_at" | "created_at">) {
  const { y, m, d } = dateParts(p.published_at || p.created_at);
  return `/${y}/${m}/${d}/${p.slug}`;
}

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "short", day: "numeric" }).format(new Date(iso));
}

export function readingTime(md: string) {
  const words = md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const marked = new Marked({ gfm: true, breaks: false });
marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const id = slugify(text.replace(/<[^>]+>/g, ""));
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href) && !href.startsWith(SITE_URL);
      const t = title ? ` title="${esc(title)}"` : "";
      return external
        ? `<a href="${esc(href)}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`
        : `<a href="${esc(href)}"${t}>${text}</a>`;
    },
    image({ href, title, text }) {
      const t = title ? ` title="${esc(title)}"` : "";
      return `<img src="${esc(href)}" alt="${esc(text)}"${t} loading="lazy" decoding="async">`;
    },
  },
});

export function renderMarkdown(md: string) {
  const html = marked.parse(md || "", { async: false }) as string;
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "del", "figure", "figcaption", "details", "summary", "kbd"]),
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "loading", "decoding", "width", "height"],
      code: ["class"],
      h1: ["id"], h2: ["id"], h3: ["id"], h4: ["id"], h5: ["id"], h6: ["id"],
      th: ["align"], td: ["align"],
      ol: ["start"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

/** JSON for an inline <script type="application/ld+json">; escaping "<" stops a stray "</script>" from closing the tag. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function toc(md: string) {
  return [...(md || "").replace(/```[\s\S]*?```/g, "").matchAll(/^(##)\s+(.+)$/gm)].map((m) => {
    const text = m[2].replace(/[*_`]/g, "").trim();
    return { id: slugify(text), text };
  });
}
