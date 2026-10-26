import type { Settings } from "@/lib/types";
import { formatDate } from "@/lib/format";

const DOMAINS = ["PAM", "Network security", "Identity", "Forensics"];

/**
 * The homepage signature: the profile rendered as a security console record,
 * one nod to a SOC asset view and a CyberArk privileged account. Values unmask
 * once on load (pure CSS, so it works without JS and respects reduced-motion).
 */
export default function VaultCard({ s, lastPost }: { s: Settings; lastPost: string | null }) {
  const parts = s.site_title.trim().toLowerCase().split(/\s+/);
  const username = parts.length > 1 ? `${parts[0][0]}.${parts[parts.length - 1]}` : parts[0];
  const codes = s.certifications.map((c) => c.code || c.name).filter(Boolean);

  const rows: { k: string; v: React.ReactNode }[] = [
    { k: "Identity", v: username },
    { k: "Role", v: s.headline },
    {
      k: "Domains",
      v: <span className="creds">{DOMAINS.map((d) => <span key={d} className="tag">{d}</span>)}</span>,
    },
    {
      k: "Credentials",
      v: <span className="creds">{codes.map((c) => <span key={c} className="cred">{c}</span>)}</span>,
    },
    { k: "Last change", v: lastPost ? `${formatDate(lastPost)}, new write-up` : "Pending" },
    { k: "Telemetry", v: "Logged, recorded and audited" },
  ];

  return (
    <section className="vault" aria-label="Profile summary">
      <div className="vault-head">
        <span>Security profile</span>
        <span className="status">Monitored</span>
      </div>
      <dl>
        {rows.map((r, i) => (
          <div key={r.k}>
            <dt>{r.k}</dt>
            <dd>
              <span className="reveal" style={{ ["--i" as string]: i }}>{r.v}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="vault-foot">
        <small>Access by request</small>
        <a href="#contact" className="btn primary">Connect</a>
      </div>
    </section>
  );
}
