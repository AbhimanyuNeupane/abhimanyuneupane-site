import type { Settings } from "@/lib/types";
import { formatDate } from "@/lib/format";

/**
 * The homepage signature: Adam's profile rendered as a CyberArk-style privileged
 * account record. Values unmask once on load (pure CSS, so it works without JS
 * and respects reduced-motion).
 */
export default function VaultCard({ s, lastPost }: { s: Settings; lastPost: string | null }) {
  const parts = s.site_title.trim().toLowerCase().split(/\s+/);
  const username = parts.length > 1 ? `${parts[0][0]}.${parts[parts.length - 1]}` : parts[0];
  const codes = s.certifications.map((c) => c.code || c.name).filter(Boolean);

  const rows: { k: string; v: React.ReactNode }[] = [
    { k: "Safe", v: "Public-Profile" },
    { k: "Username", v: username },
    { k: "Platform", v: s.headline },
    {
      k: "Credentials",
      v: <span className="creds">{codes.map((c) => <span key={c} className="cred">{c}</span>)}</span>,
    },
    { k: "Last change", v: lastPost ? `${formatDate(lastPost)}, new write-up` : "Pending" },
    { k: "Sessions", v: "Recorded and audited" },
  ];

  return (
    <section className="vault" aria-label="Profile summary">
      <div className="vault-head">
        <span>Privileged account</span>
        <span className="status">Managed</span>
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
