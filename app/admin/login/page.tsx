import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";
import { KeyMark } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");
  const { error } = await searchParams;
  return (
    <div className="login">
      <div className="login-card">
        <span className="accent"><KeyMark /></span>
        <h1>Admin sign in</h1>
        <p>Only the site owner&apos;s account can access the dashboard.</p>
        {error && <div className="notice err">Sign-in failed. Try again.</div>}
        <LoginForm />
      </div>
    </div>
  );
}
