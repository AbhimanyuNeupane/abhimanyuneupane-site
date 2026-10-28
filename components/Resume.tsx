import type { Settings } from "@/lib/types";

/** Work history, newest first: role, company and dates only. */
export function Timeline({ jobs }: { jobs: Settings["experience"] }) {
  return (
    <ol className="timeline">
      {jobs.map((j) => {
        const current = j.end.toLowerCase() === "present";
        return (
          <li key={`${j.org}-${j.start}`} className={current ? "current" : undefined}>
            <div className="tl-main">
              <h3>{j.role}</h3>
              <p>{j.org}{j.place ? <span className="tl-place"> · {j.place}</span> : null}</p>
            </div>
            <p className="tl-when">
              {current && <span className="tl-now">Current</span>}
              {j.start} – {j.end}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

/** Tool groups, each with its tools as chips. */
export function Toolkit({ groups }: { groups: Settings["toolkit"] }) {
  return (
    <dl className="toolkit">
      {groups.map((g) => (
        <div key={g.group}>
          <dt>{g.group}</dt>
          <dd className="chips">
            {g.items.split(",").map((t) => t.trim()).filter(Boolean).map((t) => <span key={t} className="chip">{t}</span>)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CertList({ certs }: { certs: Settings["certifications"] }) {
  return (
    <ul className="cert-list">
      {certs.map((c) => (
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
  );
}

export function EducationList({ items }: { items: Settings["education"] }) {
  return (
    <ul className="cert-list">
      {items.map((e) => (
        <li key={e.title}>
          <span className="name">{e.title}</span>
          <span className="issuer">{[e.school, e.note].filter(Boolean).join(" · ")}</span>
          {e.dates && <span className="code">{e.dates}</span>}
        </li>
      ))}
    </ul>
  );
}
