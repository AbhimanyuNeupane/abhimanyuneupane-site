import Link from "next/link";
import PostRow, { FeaturedPost } from "@/components/PostRow";
import { Icon } from "@/components/SiteChrome";
import VaultCard from "@/components/VaultCard";
import { getPublishedPosts, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/format";

export const revalidate = 300;

export default async function Home() {
  const [s, posts] = await Promise.all([getSettings(), getPublishedPosts()]);
  const [featured, ...rest] = posts;
  const more = rest.slice(0, 4);
  const [first, ...last] = s.site_title.split(" ");
  const avatar = s.avatar_url || "/avatar.jpg";
  // Running character index so the name animates in one continuous sweep across both lines.
  let ci = 0;
  const letters = (word: string) =>
    [...word].map((ch) => (
      <span key={ci} className="char" style={{ ["--c" as string]: ci++ }}>{ch}</span>
    ));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: s.site_title,
    jobTitle: s.headline,
    url: SITE_URL,
    image: new URL(avatar, SITE_URL).toString(),
    sameAs: [s.linkedin_url, s.github_url, s.medium_url].filter(Boolean),
    hasCredential: s.certifications.map((c) => ({ "@type": "EducationalOccupationalCredential", name: c.name })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero">
        <div className="wrap">
          <div>
            <div className="hero-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatar} alt={s.site_title} width={132} height={132} />
            </div>
            <p className="hero-prompt rise" aria-hidden="true" style={{ ["--d" as string]: ".15s" }}>
              <span className="accent">$</span> whoami
            </p>
            <h1 className="hero-name" aria-label={s.site_title}>
              <span aria-hidden="true">{letters(first)}</span>
              {last.length > 0 && <span aria-hidden="true">{letters(last.join(" "))}</span>}
            </h1>
            <p className="hero-role" aria-label={s.headline}>
              <span aria-hidden="true">
                {[...s.headline].map((ch, i) => (
                  <span key={i} className="type" style={{ ["--t" as string]: i }}>{ch}</span>
                ))}
              </span>
              <span className="caret" aria-hidden="true" style={{ ["--n" as string]: s.headline.length }} />
            </p>
            {s.tagline && <p className="hero-tagline rise" style={{ ["--d" as string]: "1.5s" }}>{s.tagline}</p>}
            <div className="hero-actions rise" style={{ ["--d" as string]: "1.7s" }}>
              {s.linkedin_url && (
                <a href={s.linkedin_url} className="btn primary" target="_blank" rel="noopener noreferrer">{Icon.linkedin} LinkedIn</a>
              )}
              {s.resume_url && <Link href="/resume" className="btn">{Icon.file} Resume</Link>}
            </div>
          </div>
          <VaultCard s={s} lastPost={featured?.published_at ?? null} />
        </div>
      </section>

      {featured && (
        <section className="section" id="writing">
          <div className="wrap">
            <div className="section-head">
              <div>
                <h2>Writing</h2>
                <p>Step-by-step notes from real security work: privileged access, firewalls and VPNs, Active Directory and PKI.</p>
              </div>
              <Link href="/blog" className="text-link">All {posts.length} posts</Link>
            </div>
            <FeaturedPost p={featured} />
            {more.length > 0 && (
              <ul className="post-list">
                {more.map((p) => <PostRow key={p.id} p={p} />)}
              </ul>
            )}
          </div>
        </section>
      )}

      {(s.featured.length > 0 || s.skills.length > 0) && (
        <section className="section" id="work">
          <div className="wrap">
            <div className="section-head"><h2>What I work on</h2></div>
            {s.featured.length > 0 && (
              <div className="areas">
                {s.featured.map((f) => (
                  <div key={f.title} className="area">
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                ))}
              </div>
            )}
            {s.skills.length > 0 && (
              <div className="toolkit">
                <h3>Tools I use</h3>
                <div className="chips">
                  {s.skills.map((k) => <span key={k} className="chip">{k}</span>)}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {(s.about || s.certifications.length > 0) && (
        <section className="section" id="about">
          <div className="wrap about">
            <div>
              <div className="section-head"><h2>About</h2></div>
              <div className="prose">
                {s.about.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
              </div>
              {(s.now_text || s.location) && (
                <dl className="now">
                  {s.now_text && <div><dt>Now</dt><dd>{s.now_text}</dd></div>}
                  {s.location && <div><dt>Based in</dt><dd>{s.location}</dd></div>}
                </dl>
              )}
            </div>
            {s.certifications.length > 0 && (
              <div>
                <h3 className="aside-title">Certifications</h3>
                <ul className="cert-list">
                  {s.certifications.map((c) => (
                    <li key={c.name}>
                      {c.url ? (
                        <a className="name" href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>
                      ) : (
                        <span className="name">{c.name}</span>
                      )}
                      {c.issuer && <span className="issuer">{c.issuer}</span>}
                      {c.code && <span className="code">{c.code}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="contact" id="contact">
        <div className="wrap">
          <div>
            <h2>Request access.</h2>
            <p>Questions about a write-up, a security project or an opportunity? I read every message.</p>
          </div>
          <div className="actions">
            {s.linkedin_url && (
              <a href={s.linkedin_url} className="btn primary" target="_blank" rel="noopener noreferrer">{Icon.linkedin} Message me on LinkedIn</a>
            )}
            {s.email && <a href={`mailto:${s.email}`} className="btn">{Icon.mail} Email</a>}
          </div>
        </div>
      </section>
    </>
  );
}
