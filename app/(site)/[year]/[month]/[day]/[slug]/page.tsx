import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getPostBySlug, getPublishedPosts, getSettings } from "@/lib/data";
import { formatDate, jsonLdString, postPath, readingTime, renderMarkdown, SITE_URL, slugify, toc } from "@/lib/format";

export const revalidate = 300;

type Params = { year: string; month: string; day: string; slug: string };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => {
    const [, year, month, day, slug] = postPath(p).split("/");
    return { year, month, day, slug };
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) return {};
  const url = postPath(p);
  return {
    title: p.title,
    description: p.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.excerpt ?? undefined,
      url,
      publishedTime: p.published_at ?? undefined,
      modifiedTime: p.updated_at,
      images: p.cover_image ? [p.cover_image] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { year, month, day, slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) notFound();

  const canonical = postPath(p);
  if (canonical !== `/${year}/${month}/${day}/${slug}`) permanentRedirect(canonical);

  const [s, all] = await Promise.all([getSettings(), getPublishedPosts()]);
  const idx = all.findIndex((x) => x.id === p.id);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const headings = toc(p.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.published_at,
    dateModified: p.updated_at,
    image: p.cover_image || undefined,
    author: { "@type": "Person", name: s.site_title, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}${canonical}`,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="wrap">
        <header className="article-head">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/blog">Writing</Link>
            {p.category && (
              <>
                <span aria-hidden="true">/</span>
                <Link className="cat" href={`/blog?category=${slugify(p.category)}`}>{p.category}</Link>
              </>
            )}
          </nav>
          <h1>{p.title}</h1>
          {p.excerpt && <p className="lede">{p.excerpt}</p>}
          <div className="post-meta">
            <time dateTime={p.published_at ?? undefined}>{formatDate(p.published_at)}</time>
            <span>{readingTime(p.content)} min read</span>
          </div>
        </header>
        {p.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="cover" src={p.cover_image} alt="" />
        )}
        <div className="article-body">
          <div>
            <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }} />
            <nav className="post-nav" aria-label="More posts">
              {older ? (
                <Link href={postPath(older)}><small>Previous post</small><strong>{older.title}</strong></Link>
              ) : <span />}
              {newer ? (
                <Link href={postPath(newer)} className="next"><small>Next post</small><strong>{newer.title}</strong></Link>
              ) : <span />}
            </nav>
          </div>
          {headings.length > 2 && (
            <aside className="toc" aria-label="On this page">
              <p className="aside-title">On this page</p>
              {headings.map((h) => <a key={h.id} href={`#${h.id}`}>{h.text}</a>)}
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
