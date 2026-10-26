import Link from "next/link";
import type { Settings } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

export function KeyMark({ className = "brand-key" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2" />
    </svg>
  );
}

export function Header({ s }: { s: Settings }) {
  const [first, ...rest] = s.site_title.split(" ");
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label={`${s.site_title}, home`}>
          <KeyMark />
          <span>
            {first} <span className="brand-name-last">{rest.join(" ")}</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Main">
          <Link href="/blog">Writing</Link>
          <Link href="/#about" className="hide-sm">About</Link>
          <Link href="/resume">Resume</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export function Footer({ s }: { s: Settings }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>© {new Date().getFullYear()} {s.site_title}</span>
        <nav aria-label="Elsewhere">
          {s.linkedin_url && <a href={s.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {s.github_url && <a href={s.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>}
          {s.medium_url && <a href={s.medium_url} target="_blank" rel="noopener noreferrer">Medium</a>}
          <a href="/feed.xml">RSS</a>
        </nav>
      </div>
    </footer>
  );
}

export const Icon = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>
  ),
};
