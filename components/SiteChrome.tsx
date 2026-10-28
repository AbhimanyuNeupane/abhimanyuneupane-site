import Link from "next/link";
import type { Settings } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

export function Header({ s }: { s: Settings }) {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label={`${s.site_title}, home`}>{s.site_title}</Link>
        <nav className="nav" aria-label="Main">
          <Link href="/#experience" className="hide-sm">Experience</Link>
          <Link href="/blog">Writing</Link>
          <Link href="/resume">Résumé</Link>
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
        <span>© {new Date().getFullYear()} {s.site_title}{s.location ? ` · ${s.location}` : ""}</span>
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
