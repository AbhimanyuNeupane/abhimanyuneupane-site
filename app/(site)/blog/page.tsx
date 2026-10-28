import type { Metadata } from "next";
import Link from "next/link";
import PostRow from "@/components/PostRow";
import { getPublishedPosts } from "@/lib/data";
import { slugify } from "@/lib/format";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Writing",
  description: "Hands-on write-ups on CyberArk PAM, network security, Windows Server and PKI.",
  alternates: { canonical: "/blog" },
};

export default async function Blog({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const posts = await getPublishedPosts();
  const cats = [...new Set(posts.map((p) => p.category).filter(Boolean) as string[])].sort();
  const shown = category ? posts.filter((p) => p.category && slugify(p.category) === category) : posts;

  return (
    <div className="wrap" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <h1>Writing</h1>
        <p>Notes on things I&apos;ve set up at work, written down so I don&apos;t have to figure them out twice.</p>
      </div>
      {cats.length > 1 && (
        <nav className="filters" aria-label="Categories">
          <Link href="/blog" className={`chip ${!category ? "active" : ""}`}>All</Link>
          {cats.map((c) => (
            <Link key={c} href={`/blog?category=${slugify(c)}`} className={`chip ${category === slugify(c) ? "active" : ""}`}>{c}</Link>
          ))}
        </nav>
      )}
      <ul className="post-list" style={{ borderTop: "1px solid var(--line)" }}>
        {shown.map((p) => <PostRow key={p.id} p={p} />)}
      </ul>
      {shown.length === 0 && <p className="muted" style={{ padding: "24px 0" }}>No posts in this category yet. <Link className="text-link" href="/blog">Show all posts</Link></p>}
    </div>
  );
}
