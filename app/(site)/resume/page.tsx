import type { Metadata } from "next";
import { CertList, EducationList, Timeline, Toolkit } from "@/components/Resume";
import { Icon } from "@/components/SiteChrome";
import { getSettings } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "Resume", alternates: { canonical: "/resume" } };

export default async function Resume() {
  const s = await getSettings();
  return (
    <div className="wrap" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <h1>Resume</h1>
        <p>{s.headline}{s.location ? ` · ${s.location}` : ""}</p>
        {s.resume_url && (
          <a href={s.resume_url} className="btn primary" target="_blank" rel="noopener noreferrer" style={{ marginTop: 20 }}>{Icon.download} Download PDF</a>
        )}
      </div>

      {s.experience.length > 0 && (
        <section className="resume-block">
          <h2 className="aside-title">Experience</h2>
          <Timeline jobs={s.experience} />
        </section>
      )}

      {s.toolkit.length > 0 && (
        <section className="resume-block">
          <h2 className="aside-title">Tools</h2>
          <Toolkit groups={s.toolkit} />
        </section>
      )}

      <div className="resume-cols">
        {s.certifications.length > 0 && (
          <section className="resume-block">
            <h2 className="aside-title">Certifications</h2>
            <CertList certs={s.certifications} />
          </section>
        )}
        {s.education.length > 0 && (
          <section className="resume-block">
            <h2 className="aside-title">Education</h2>
            <EducationList items={s.education} />
          </section>
        )}
      </div>
    </div>
  );
}
