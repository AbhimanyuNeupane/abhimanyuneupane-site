import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, postPath } from "@/lib/format";
import type { Post } from "@/lib/types";
import { togglePublish } from "../actions";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, category, published, published_at, created_at, updated_at")
    .order("published_at", { ascending: false, nullsFirst: true });
  const posts = (data ?? []) as Post[];
  const live = posts.filter((p) => p.published).length;

  return (
    <>
      <div className="admin-title">
        <div>
          <h1>Posts</h1>
          <p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>{live} published, {posts.length - live} drafts</p>
        </div>
        <Link href="/admin/posts/new" className="btn primary">Write a post</Link>
      </div>
      {posts.length === 0 ? (
        <div className="panel">No posts yet. <Link className="accent" href="/admin/posts/new">Write your first one.</Link></div>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Title</th><th className="hide-sm">Category</th><th className="hide-sm">Date</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td><Link className="title" href={`/admin/posts/${p.id}`}>{p.title}</Link></td>
                <td className="hide-sm muted">{p.category ?? "None"}</td>
                <td className="hide-sm muted">{formatDate(p.published_at) || "Not set"}</td>
                <td><span className={`badge ${p.published ? "live" : "draft"}`}>{p.published ? "Published" : "Draft"}</span></td>
                <td>
                  <div className="row" style={{ justifyContent: "flex-end", flexWrap: "nowrap" }}>
                    {p.published && <a className="btn sm ghost hide-sm" href={postPath(p)} target="_blank" rel="noopener">View</a>}
                    <form action={togglePublish}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="publish" value={p.published ? "0" : "1"} />
                      <button className="btn sm">{p.published ? "Unpublish" : "Publish"}</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
