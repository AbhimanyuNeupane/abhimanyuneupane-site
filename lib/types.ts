export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Certification = { name: string; code?: string; issuer?: string; url?: string };
export type Featured = { title: string; body: string };

export type Settings = {
  site_title: string;
  headline: string;
  tagline: string;
  about: string;
  avatar_url: string | null;
  resume_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  medium_url: string | null;
  certifications: Certification[];
  skills: string[];
  featured: Featured[];
  accent: string;
  now_text: string;
  location: string;
};
