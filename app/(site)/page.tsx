import Link from "next/link";
import PostRow from "@/components/PostRow";
import { Credentials, Timeline, Toolkit } from "@/components/Resume";
import { getPublishedPosts, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/format";

export const revalidate = 300;

const DEFAULT_PHOTO = "/avatar.jpg";

export default async function Home() {
  const [s, posts] = await Promise.all([getSettings(), getPublishedPosts()]);
  const recent = posts.slice(0, 5);
  const avatar = s.avatar_url || DEFAULT_PHOTO;
  const words = s.site_title.split(" ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: s.site_title,
    jobTitle: s.experience[0]?.role || s.headline,
    worksFor: s.experience[0] ? { "@type": "Organization", name: s.experience[0].org } : undefined,
    url: SITE_URL,
    image: new URL(avatar, SITE_URL).toString(),
    sameAs: [s.linkedin_url, s.github_url, s.medium_url].filter(Boolean),
    hasCredential: s.certifications.map((c) => ({ "@type": "EducationalOccupationalCredential", name: c.name })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="intro">
        <div className="wrap">
          <div>
            {s.location && <p className="label fade" style={{ ["--d" as string]: "0s" }}>{s.location}</p>}
            <h1 className="intro-name">
              {words.map((w, i) => (
                <span key={w + i} className="redact" style={{ ["--i" as string]: i }}>{w}</span>
              ))}
            </h1>
            {s.tagline && <p className="intro-lede fade" style={{ ["--d" as string]: ".9s" }}>{s.tagline}</p>}
            <p className="intro-links fade" style={{ ["--d" as string]: "1.1s" }}>
              {s.linkedin_url && <a href={s.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              <Link href="/resume">Résumé</Link>
              <a href="#writing">Writing</a>
              {s.medium_url && <a href={s.medium_url} target="_blank" rel="noopener noreferrer">Medium</a>}
            </p>
          </div>
          <figure className="portrait fade" style={{ ["--d" as string]: ".5s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt={s.site_title} width={240} height={240} />
            {avatar === DEFAULT_PHOTO && <figcaption>Boudhanath, Kathmandu</figcaption>}
          </figure>
        </div>
      </section>

      {s.experience.length > 0 && (
        <section className="sec" id="experience">
          <div className="wrap sec-grid">
            <h2>Experience</h2>
            <div>
              <Timeline jobs={s.experience} />
              <Link href="/resume" className="text-link">Full résumé</Link>
            </div>
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="sec" id="writing">
          <div className="wrap sec-grid">
            <h2>Writing</h2>
            <div>
              <ul className="post-list">
                {recent.map((p) => <PostRow key={p.id} p={p} />)}
              </ul>
              {posts.length > recent.length && <Link href="/blog" className="text-link">All {posts.length} posts</Link>}
            </div>
          </div>
        </section>
      )}

      {s.about && (
        <section className="sec" id="about">
          <div className="wrap sec-grid">
            <h2>About</h2>
            <div>
              <div className="prose about-prose">
                {s.about.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
              </div>
              {s.now_text && <p className="now-line"><span className="label">Now</span> {s.now_text}</p>}
            </div>
          </div>
        </section>
      )}

      {s.toolkit.length > 0 && (
        <section className="sec" id="toolkit">
          <div className="wrap sec-grid">
            <h2>Toolkit</h2>
            <Toolkit groups={s.toolkit} />
          </div>
        </section>
      )}

      {(s.certifications.length > 0 || s.education.length > 0) && (
        <section className="sec" id="credentials">
          <div className="wrap sec-grid">
            <h2>Credentials</h2>
            <Credentials s={s} />
          </div>
        </section>
      )}

      <section className="sec contact" id="contact">
        <div className="wrap sec-grid">
          <h2>Contact</h2>
          <div>
            <p className="contact-line">
              Questions about a write-up, or want to talk about a role? LinkedIn is the quickest way to reach me.
            </p>
            <p className="intro-links">
              {s.linkedin_url && <a href={s.linkedin_url} target="_blank" rel="noopener noreferrer">Message me on LinkedIn</a>}
              {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
