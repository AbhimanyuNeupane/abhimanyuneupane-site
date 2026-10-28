import type { Settings } from "@/lib/types";

/** Work history, newest first. The current role gets a filled marker. */
export function Timeline({ jobs }: { jobs: Settings["experience"] }) {
  return (
    <ol className="timeline">
      {jobs.map((j) => (
        <li key={`${j.org}-${j.start}`} className={j.end.toLowerCase() === "present" ? "now" : undefined}>
          <p className="when">{j.start} – {j.end}</p>
          <div className="what">
            <h3>{j.role}</h3>
            <p className="where">{j.org}{j.place ? `, ${j.place}` : ""}</p>
            {j.points.length > 0 && (
              <ul>{j.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Toolkit({ groups }: { groups: Settings["toolkit"] }) {
  return (
    <dl className="toolkit">
      {groups.map((g) => (
        <div key={g.group}>
          <dt>{g.group}</dt>
          <dd>{g.items}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Credentials({ s }: { s: Settings }) {
  return (
    <div className="creds-grid">
      {s.certifications.length > 0 && (
        <div>
          <h3 className="label">Certifications</h3>
          <ul className="plain-list">
            {s.certifications.map((c) => (
              <li key={c.name}>
                {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a> : c.name}
                {c.issuer && <span>{c.issuer}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {s.education.length > 0 && (
        <div>
          <h3 className="label">Education</h3>
          <ul className="plain-list">
            {s.education.map((e) => (
              <li key={e.title}>
                {e.title}
                <span>{[e.school, e.dates].filter(Boolean).join(", ")}</span>
                {e.note && <span>{e.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
