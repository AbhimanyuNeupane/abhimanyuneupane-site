import Link from "next/link";
import type { Post, Settings } from "@/lib/types";
import { postPath } from "@/lib/format";

/** A short at-a-glance card next to the intro: current role, base, certifications, latest post. */
export default function VaultCard({ s, latest }: { s: Settings; latest: Post | null }) {
  const job = s.experience[0];
  const studying = s.certifications.filter((c) => /in progress/i.test(c.name));
  const earned = s.certifications.filter((c) => !/in progress/i.test(c.name));

  const rows: { k: string; v: React.ReactNode }[] = [];
  if (job) rows.push({ k: "Currently", v: <>{job.role}, {job.org}</> });
  if (s.location) rows.push({ k: "Based in", v: s.location });
  if (earned.length) rows.push({ k: "Certified", v: earned.map((c) => c.code || c.name).join(", ") });
  if (studying.length) rows.push({ k: "Studying for", v: studying.map((c) => c.code || c.name.replace(/\s*\(in progress\)/i, "")).join(", ") });
  if (latest) rows.push({ k: "Latest post", v: <Link href={postPath(latest)}>{latest.title}</Link> });

  return (
    <aside className="glance" aria-label="At a glance">
      <dl>
        {rows.map((r) => (
          <div key={r.k}>
            <dt>{r.k}</dt>
            <dd>{r.v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
