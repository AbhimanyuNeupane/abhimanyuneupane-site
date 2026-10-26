import Link from "next/link";
import { formatDate, postPath, readingTime } from "@/lib/format";
import type { Post } from "@/lib/types";

export default function PostRow({ p }: { p: Post }) {
  return (
    <li>
      <Link href={postPath(p)} className="post-row">
        <time className="date" dateTime={p.published_at ?? undefined}>{formatDate(p.published_at)}</time>
        <div>
          <h3>{p.title}</h3>
          {p.excerpt && <p>{p.excerpt}</p>}
        </div>
        {p.category ? <span className="cat">{p.category}</span> : <span />}
      </Link>
    </li>
  );
}

export function FeaturedPost({ p }: { p: Post }) {
  return (
    <Link href={postPath(p)} className="feature">
      {p.cover_image ? (
        <div className="cover-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover_image} alt="" />
        </div>
      ) : <span />}
      <div>
        <div className="post-meta">
          {p.category && <span className="cat">{p.category}</span>}
          <time dateTime={p.published_at ?? undefined}>{formatDate(p.published_at)}</time>
          <span>{readingTime(p.content)} min read</span>
        </div>
        <h3>{p.title}</h3>
        {p.excerpt && <p>{p.excerpt}</p>}
        <span className="text-link">Read the write-up</span>
      </div>
    </Link>
  );
}
