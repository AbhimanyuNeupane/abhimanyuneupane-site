import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    return (
      <div className="login">
        <div className="login-card">
          <h1>No admin access</h1>
          <p>You&apos;re signed in as {user.email}, which isn&apos;t the site owner&apos;s account. Sign out and use the owner&apos;s Google account.</p>
          <form action={signOut}><button className="btn">Sign out</button></form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-bar">
        <div className="wrap">
          <nav aria-label="Admin">
            <Link href="/admin"><strong style={{ color: "var(--text)" }}>Dashboard</strong></Link>
            <Link href="/admin/posts/new">New post</Link>
            <Link href="/admin/settings">Site settings</Link>
            <a href="/" target="_blank" rel="noopener">View site</a>
          </nav>
          <form action={signOut} className="row">
            <span className="muted hide-sm" style={{ fontSize: 13 }}>{user.email}</span>
            <button className="btn sm ghost">Sign out</button>
          </form>
        </div>
      </header>
      <main className="admin-main"><div className="wrap">{children}</div></main>
    </div>
  );
}
