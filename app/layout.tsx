import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import { getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/format";
import "./globals.css";


export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = `${s.site_title} · ${s.headline}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${s.site_title}` },
    description: s.tagline,
    alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
    openGraph: { type: "website", siteName: s.site_title, title, description: s.tagline, url: "/" },
    twitter: { card: "summary_large_image", title, description: s.tagline },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#10161d" },
    { media: "(prefers-color-scheme: light)", color: "#f3f5f7" },
  ],
};

// Applies the saved theme before paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const accent = /^#[0-9a-f]{6}$/i.test(s.accent) ? s.accent : "#e0b25a";
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <style>{`:root:not([data-theme="light"]){--accent:${accent}}@media (prefers-color-scheme: light){:root:not([data-theme="dark"]){--accent:color-mix(in srgb, ${accent} 62%, #000)}}:root[data-theme="light"]{--accent:color-mix(in srgb, ${accent} 62%, #000)}`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
