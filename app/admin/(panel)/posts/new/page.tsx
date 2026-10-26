import PostEditor from "@/components/admin/PostEditor";
import { createClient } from "@/lib/supabase/server";

export default async function NewPost() {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("category");
  const categories = [...new Set((data ?? []).map((r) => r.category).filter(Boolean))] as string[];
  return (
    <>
      <div className="admin-title"><h1>New post</h1></div>
      <PostEditor categories={categories} />
    </>
  );
}
