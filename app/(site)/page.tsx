import Link from "next/link";
import PostRow, { FeaturedPost } from "@/components/PostRow";
import { CertList, EducationList, Timeline, Toolkit } from "@/components/Resume";
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
          <div className="hero-intro">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-photo" src={avatar} alt={s.site_title} width={112} height={112} />
            <h1 className="hero-name">
              <span>{first}</span>
              {last.length > 0 && <span>{last.join(" ")}</span>}
            </h1>
            <p className="hero-role">{s.headline}</p>
            {s.tagline && <p className="hero-tagline">{s.tagline}</p>}
            <div className="hero-actions">
              {s.linkedin_url && (
                <a href={s.linkedin_url} className="btn primary" target="_blank" rel="noopener noreferrer">{Icon.linkedin} LinkedIn</a>
              )}
              <Link href="/resume" className="btn">{Icon.file} Resume</Link>
            </div>
          </div>
          <VaultCard s={s} latest={featured ?? null} />
        </div>
      </section>

      {s.experience.length > 0 && (
        <section className="section" id="experience">
          <div className="wrap">
            <div className="section-head">
              <h2>Experience</h2>
              <Link href="/resume" className="text-link">Full resume</Link>
            </div>
            <Timeline jobs={s.experience} />
          </div>
        </section>
      )}

      {featured && (
        <section className="section" id="writing">
          <div className="wrap">
            <div className="section-head">
              <div>
                <h2>Writing</h2>
                <p>How-tos from things I&apos;ve set up and fixed, mostly firewalls, VPNs, Active Directory and CyberArk.</p>
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

      {(s.featured.length > 0 || s.toolkit.length > 0) && (
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
            {s.toolkit.length > 0 && (
              <div className="toolkit-wrap">
                <h3 className="aside-title">Tools I use</h3>
                <Toolkit groups={s.toolkit} />
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
            {(s.certifications.length > 0 || s.education.length > 0) && (
              <div>
                {s.certifications.length > 0 && (
                  <>
                    <h3 className="aside-title">Certifications</h3>
                    <CertList certs={s.certifications} />
                  </>
                )}
                {s.education.length > 0 && (
                  <>
                    <h3 className="aside-title" style={{ marginTop: 36 }}>Education</h3>
                    <EducationList items={s.education} />
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="contact" id="contact">
        <div className="wrap">
          <div>
            <h2>Get in touch</h2>
            <p>If you have a question about one of the posts, or want to talk about a role, LinkedIn is the best place to reach me.</p>
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
