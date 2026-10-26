import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { createClient } from "@/lib/supabase/server";
import { postPath } from "@/lib/format";
import type { Post } from "@/lib/types";

export default async function EditPost({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const supabase = await createClient();
  const [{ data: post }, { data: cats }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("posts").select("category"),
  ]);
  if (!post) notFound();
  const categories = [...new Set((cats ?? []).map((r) => r.category).filter(Boolean))] as string[];
  const p = post as Post;

  return (
    <>
      <div className="admin-title">
        <h1>Edit post</h1>
        {p.published && <a className="btn sm" href={postPath(p)} target="_blank" rel="noopener">View live post</a>}
      </div>
      <PostEditor key={p.updated_at} post={p} categories={categories} created={created === "1"} />
    </>
  );
}
