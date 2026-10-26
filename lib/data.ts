import { cache } from "react";
import { createPublicClient } from "./supabase/server";
import type { Post, Settings } from "./types";

const FALLBACK: Settings = {
  site_title: "Abhimanyu Neupane",
  headline: "Security Analyst",
  tagline: "",
  about: "",
  avatar_url: null,
  resume_url: null,
  email: null,
  linkedin_url: null,
  github_url: null,
  medium_url: null,
  certifications: [],
  skills: [],
  featured: [],
  accent: "#e0b25a",
  now_text: "",
  location: "",
};

export const getSettings = cache(async (): Promise<Settings> => {
  const { data } = await createPublicClient().from("settings").select("*").eq("id", 1).maybeSingle();
  return data ? ({ ...FALLBACK, ...data } as Settings) : FALLBACK;
});

const LIST_COLS = "id, slug, title, excerpt, cover_image, category, tags, published, published_at, created_at, updated_at, content";

export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  const { data } = await createPublicClient()
    .from("posts")
    .select(LIST_COLS)
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data as Post[]) ?? [];
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const { data } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as Post) ?? null;
});
