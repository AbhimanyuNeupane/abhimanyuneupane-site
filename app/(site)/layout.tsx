import { Footer, Header } from "@/components/SiteChrome";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <a href="#main" className="sr-only">Skip to content</a>
      <Header s={s} />
      <main id="main">{children}</main>
      <Footer s={s} />
    </>
  );
}
