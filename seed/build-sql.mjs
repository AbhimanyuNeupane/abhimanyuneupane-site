// Generates seed.sql from the migrated markdown posts.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const IMG = "https://nztobuxccpkfigmxqqmb.supabase.co/storage/v1/object/public/media/migrated";

const posts = [
  {
    slug: "domain-controller-migration",
    title: "Domain Controller Migration from Windows Server 2012 R2 to Windows Server 2019",
    excerpt: "Windows Server 2012 R2 is out of support. A step-by-step walkthrough of raising the schema with Adprep, promoting a 2019 DC, verifying replication and transferring all five FSMO roles.",
    category: "Windows Server",
    tags: ["Active Directory", "FSMO", "Migration"],
    cover: `${IMG}/2022/03/Windows-Server-2019-AD-Migration.png`,
    published_at: "2022-03-31T19:51:06-05:00",
  },
  {
    slug: "what-is-ocsp-and-why-does-it-matter",
    title: "What is OCSP and Why Does It Matter?",
    excerpt: "Certificate revocation lists don't scale. How CRLs work, where they fall short, and how the Online Certificate Status Protocol gives clients a real-time answer.",
    category: "Windows Server",
    tags: ["PKI", "Certificates", "OCSP"],
    cover: `${IMG}/2024/04/ocsp-check-revoked-1-e1715128282331.png`,
    published_at: "2024-04-21T20:32:56-05:00",
  },
  {
    slug: "edge-browser-integration-on-cyberark-psm",
    title: "Edge Browser Integration on CyberArk PSM",
    excerpt: "Switching PSM web connections from Chrome to Microsoft Edge: the driver, the Web App Dispatcher, AppLocker and a new connection component.",
    category: "CyberArk",
    tags: ["PSM", "Connection Components", "Edge"],
    cover: `${IMG}/2024/05/Edge_Logo-e1715128331931.jpg`,
    published_at: "2024-05-05T17:52:22-05:00",
  },
  {
    slug: "palo-alto-site-to-site-vpns",
    title: "Palo Alto Site-to-Site VPNs",
    excerpt: "How PAN-OS builds route-based IPsec tunnels: IKE Phase 1 and 2, proxy IDs, tunnel interfaces and the three objects every site-to-site VPN needs.",
    category: "Network",
    tags: ["Palo Alto", "IPsec", "VPN"],
    cover: `${IMG}/2024/05/SitetoSiteVPN.png`,
    published_at: "2024-05-07T12:09:43-05:00",
  },
  {
    slug: "ldap-authentication-on-ssl-vpn-fortigate",
    title: "LDAP Authentication on SSL VPN with FortiGate",
    excerpt: "Back FortiGate SSL VPN logins with Active Directory: add the LDAP server, import users, map a group to a portal and write the firewall policy.",
    category: "Network",
    tags: ["FortiGate", "LDAP", "SSL VPN"],
    cover: `${IMG}/2024/05/image-24-e1716087357440.png`,
    published_at: "2024-05-18T21:52:37-05:00",
  },
];

// Dollar-quote with a tag that can't appear in the content.
const q = (s) => {
  if (s.includes("$md$")) throw new Error("tag collision");
  return `$md$${s}$md$`;
};

const rows = posts.map((p) => {
  const content = readFileSync(join(dir, `${p.slug}.md`), "utf8").trim();
  const tags = `ARRAY[${p.tags.map((t) => q(t)).join(",")}]::text[]`;
  return `(${q(p.slug)}, ${q(p.title)}, ${q(p.excerpt)}, ${q(content)}, ${q(p.cover)}, ${q(p.category)}, ${tags}, true, ${q(p.published_at)}::timestamptz)`;
});

const sql = `insert into public.posts (slug, title, excerpt, content, cover_image, category, tags, published, published_at) values
${rows.join(",\n")}
on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content,
  cover_image = excluded.cover_image, category = excluded.category, tags = excluded.tags,
  published = excluded.published, published_at = excluded.published_at;`;

writeFileSync(join(dir, "seed.sql"), sql);
console.log(`wrote ${sql.length} chars`);
