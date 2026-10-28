"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { renderMarkdown, slugify } from "@/lib/format";
import type { Certification, Featured, Job, Schooling, ToolGroup } from "@/lib/types";

export type ActionState = { ok?: string; error?: string } | null;

/** Every mutation re-checks admin status; RLS enforces it again at the database. */
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) throw new Error("Not authorized");
  return supabase;
}

function refreshPublic() {
  revalidatePath("/", "layout");
}

// ---------- auth ----------

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- posts ----------

export async function savePost(_: ActionState, form: FormData): Promise<ActionState> {
  const supabase = await requireAdmin();
  const id = String(form.get("id") || "");
  const title = String(form.get("title") || "").trim();
  if (!title) return { error: "Title is required." };
  const slug = slugify(String(form.get("slug") || "") || title);
  if (!slug) return { error: "Slug is required." };
  const published = form.get("published") === "on";
  const dateRaw = String(form.get("published_at") || "");
  let published_at: string | null = dateRaw ? new Date(dateRaw).toISOString() : null;
  if (published && !published_at) published_at = new Date().toISOString();

  const row = {
    title,
    slug,
    excerpt: String(form.get("excerpt") || "").trim() || null,
    content: String(form.get("content") || ""),
    cover_image: String(form.get("cover_image") || "").trim() || null,
    category: String(form.get("category") || "").trim() || null,
    tags: String(form.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean),
    published,
    published_at,
  };

  if (id) {
    const { error } = await supabase.from("posts").update(row).eq("id", id);
    if (error) return { error: error.code === "23505" ? "That slug is already used by another post." : error.message };
    refreshPublic();
    return { ok: published ? "Saved and live." : "Draft saved." };
  }

  const { data, error } = await supabase.from("posts").insert(row).select("id").single();
  if (error) return { error: error.code === "23505" ? "That slug is already used by another post." : error.message };
  refreshPublic();
  redirect(`/admin/posts/${data.id}?created=1`);
}

export async function deletePost(form: FormData) {
  const supabase = await requireAdmin();
  const id = String(form.get("id") || "");
  await supabase.from("posts").delete().eq("id", id);
  refreshPublic();
  redirect("/admin");
}

export async function togglePublish(form: FormData) {
  const supabase = await requireAdmin();
  const id = String(form.get("id") || "");
  const publish = form.get("publish") === "1";
  const patch: Record<string, unknown> = { published: publish };
  if (publish) {
    const { data } = await supabase.from("posts").select("published_at").eq("id", id).single();
    if (!data?.published_at) patch.published_at = new Date().toISOString();
  }
  await supabase.from("posts").update(patch).eq("id", id);
  refreshPublic();
  revalidatePath("/admin");
}

export async function previewMarkdown(md: string) {
  await requireAdmin();
  return renderMarkdown(md);
}

// ---------- settings ----------

const urlOrNull = (v: FormDataEntryValue | null) => {
  const s = String(v || "").trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) throw new Error(`"${s}" must start with https://`);
  return s;
};

export async function saveSettings(_: ActionState, form: FormData): Promise<ActionState> {
  const supabase = await requireAdmin();
  try {
    const certifications = JSON.parse(String(form.get("certifications") || "[]")) as Certification[];
    const featured = JSON.parse(String(form.get("featured") || "[]")) as Featured[];
    const experience = JSON.parse(String(form.get("experience") || "[]")) as Job[];
    const education = JSON.parse(String(form.get("education") || "[]")) as Schooling[];
    const toolkit = JSON.parse(String(form.get("toolkit") || "[]")) as ToolGroup[];
    const accent = String(form.get("accent") || "#e0b25a");
    const email = String(form.get("email") || "").trim() || null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Public email doesn't look valid." };

    const row = {
      site_title: String(form.get("site_title") || "").trim() || "Abhimanyu Neupane",
      headline: String(form.get("headline") || "").trim(),
      tagline: String(form.get("tagline") || "").trim(),
      about: String(form.get("about") || "").trim(),
      avatar_url: urlOrNull(form.get("avatar_url")),
      resume_url: urlOrNull(form.get("resume_url")),
      email,
      linkedin_url: urlOrNull(form.get("linkedin_url")),
      github_url: urlOrNull(form.get("github_url")),
      medium_url: urlOrNull(form.get("medium_url")),
      certifications: certifications.filter((c) => c.name?.trim()).map((c) => ({ ...c, url: c.url?.trim() || undefined })),
      featured: featured.filter((f) => f.title?.trim()),
      experience: experience.filter((j) => j.role?.trim() && j.org?.trim()),
      education: education.filter((e) => e.title?.trim()),
      toolkit: toolkit.filter((t) => t.group?.trim() && t.items?.trim()),
      accent: /^#[0-9a-f]{6}$/i.test(accent) ? accent : "#e0b25a",
      now_text: String(form.get("now_text") || "").trim(),
      location: String(form.get("location") || "").trim(),
    };
    const { error } = await supabase.from("settings").update(row).eq("id", 1);
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save settings." };
  }
  refreshPublic();
  return { ok: "Settings saved. The public site is updated." };
}
