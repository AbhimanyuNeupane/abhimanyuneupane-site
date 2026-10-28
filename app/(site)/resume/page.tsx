import type { Metadata } from "next";
import { Credentials, Timeline, Toolkit } from "@/components/Resume";
import { getSettings } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "Résumé", alternates: { canonical: "/resume" } };

export default async function Resume() {
  const s = await getSettings();
  return (
    <div className="wrap" style={{ paddingBottom: 72 }}>
      <div className="page-head">
        <h1>Résumé</h1>
        <p>{s.headline}{s.location ? `, ${s.location}` : ""}.</p>
        {s.resume_url && (
          <p className="intro-links" style={{ marginTop: 18 }}>
            <a href={s.resume_url} target="_blank" rel="noopener noreferrer">Download the PDF</a>
          </p>
        )}
      </div>

      {s.experience.length > 0 && (
        <section className="sec sec-first">
          <div className="sec-grid">
            <h2>Experience</h2>
            <Timeline jobs={s.experience} />
          </div>
        </section>
      )}
      {s.toolkit.length > 0 && (
        <section className="sec">
          <div className="sec-grid">
            <h2>Toolkit</h2>
            <Toolkit groups={s.toolkit} />
          </div>
        </section>
      )}
      {(s.certifications.length > 0 || s.education.length > 0) && (
        <section className="sec">
          <div className="sec-grid">
            <h2>Credentials</h2>
            <Credentials s={s} />
          </div>
        </section>
      )}
    </div>
  );
}
