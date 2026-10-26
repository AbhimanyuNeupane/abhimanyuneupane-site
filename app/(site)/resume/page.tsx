import type { Metadata } from "next";
import { Icon } from "@/components/SiteChrome";
import { getSettings } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "Resume", alternates: { canonical: "/resume" } };

export default async function Resume() {
  const s = await getSettings();
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-head">
        <h1>Resume</h1>
        {s.resume_url && (
          <a href={s.resume_url} className="btn primary" target="_blank" rel="noopener noreferrer" style={{ marginTop: 12 }}>{Icon.download} Download PDF</a>
        )}
      </div>
      {s.resume_url ? (
        <object data={s.resume_url} type="application/pdf" className="resume-frame" aria-label="Resume PDF">
          <p className="muted">
            Your browser can&apos;t display the PDF inline. <a className="accent" href={s.resume_url}>Open the resume</a>.
          </p>
        </object>
      ) : (
        <p className="muted">Resume coming soon.</p>
      )}
    </div>
  );
}
