"use client";

import { useActionState, useState } from "react";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import type { Certification, Featured, Settings } from "@/lib/types";
import { uploadMedia } from "./upload";

export default function SettingsForm({ s }: { s: Settings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettings, null);
  const [certs, setCerts] = useState<Certification[]>(s.certifications ?? []);
  const [featured, setFeatured] = useState<Featured[]>(s.featured ?? []);
  const [avatar, setAvatar] = useState(s.avatar_url ?? "");
  const [resume, setResume] = useState(s.resume_url ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  async function upload(file: File | undefined, kind: "avatar" | "resume") {
    if (!file) return;
    setBusy(kind);
    setUploadErr(null);
    try {
      const url = await uploadMedia(file, kind);
      if (kind === "avatar") setAvatar(url);
      else setResume(url);
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  }

  const setCert = (i: number, k: keyof Certification, v: string) =>
    setCerts((c) => c.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const setFeat = (i: number, k: keyof Featured, v: string) =>
    setFeatured((c) => c.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  return (
    <form action={action}>
      <input type="hidden" name="certifications" value={JSON.stringify(certs)} />
      <input type="hidden" name="featured" value={JSON.stringify(featured)} />
      <input type="hidden" name="avatar_url" value={avatar} />
      <input type="hidden" name="resume_url" value={resume} />

      {state?.ok && <div className="notice ok">{state.ok}</div>}
      {state?.error && <div className="notice err">{state.error}</div>}
      {uploadErr && <div className="notice err">Upload failed: {uploadErr}</div>}

      <div className="form-grid">
        <div>
          <div className="panel">
            <h2>Profile</h2>
            <div className="field"><label htmlFor="site_title">Name</label><input id="site_title" name="site_title" className="input" defaultValue={s.site_title} /></div>
            <div className="field"><label htmlFor="headline">Role</label><input id="headline" name="headline" className="input" defaultValue={s.headline} /></div>
            <div className="field">
              <label htmlFor="tagline">Tagline</label>
              <textarea id="tagline" name="tagline" className="textarea" style={{ minHeight: 70 }} defaultValue={s.tagline} />
              <span className="hint">The sentence under your name on the homepage. Also used as the search-result description.</span>
            </div>
            <div className="field">
              <label htmlFor="about">About</label>
              <textarea id="about" name="about" className="textarea" style={{ minHeight: 200 }} defaultValue={s.about} />
              <span className="hint">Leave a blank line between paragraphs.</span>
            </div>
            <div className="field">
              <label htmlFor="skills">Skills</label>
              <input id="skills" name="skills" className="input" defaultValue={s.skills.join(", ")} />
              <span className="hint">Separate with commas.</span>
            </div>
            <div className="field">
              <label htmlFor="now_text">What you&apos;re working on now</label>
              <input id="now_text" name="now_text" className="input" defaultValue={s.now_text ?? ""} placeholder="Studying for…" />
              <span className="hint">One line shown in the About section. Leave empty to hide it.</span>
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" className="input" defaultValue={s.location ?? ""} placeholder="City, Province (optional)" />
              <span className="hint">Optional. Leave empty to keep it off the site.</span>
            </div>
          </div>

          <div className="panel">
            <div className="row between" style={{ marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>What I work on</h2>
              <button type="button" className="btn sm" onClick={() => setFeatured([...featured, { title: "", body: "" }])}>Add area</button>
            </div>
            <div className="list-editor">
              {featured.map((f, i) => (
                <div className="item" key={i}>
                  <div className="row">
                    <input className="input" placeholder="Title" value={f.title} onChange={(e) => setFeat(i, "title", e.target.value)} aria-label="Area title" />
                    <button type="button" className="btn sm ghost" onClick={() => setFeatured(featured.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                  <textarea className="textarea" style={{ minHeight: 70 }} placeholder="One or two sentences" value={f.body} onChange={(e) => setFeat(i, "body", e.target.value)} aria-label="Area description" />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="row between" style={{ marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Certifications</h2>
              <button type="button" className="btn sm" onClick={() => setCerts([...certs, { name: "", code: "", issuer: "" }])}>Add certification</button>
            </div>
            <div className="list-editor">
              {certs.map((c, i) => (
                <div className="item" key={i}>
                  <div className="row">
                    <input className="input" style={{ maxWidth: 120 }} placeholder="Code" value={c.code ?? ""} onChange={(e) => setCert(i, "code", e.target.value)} aria-label="Code" />
                    <input className="input" placeholder="Full name" value={c.name} onChange={(e) => setCert(i, "name", e.target.value)} aria-label="Name" />
                  </div>
                  <div className="row">
                    <input className="input" placeholder="Issuer" value={c.issuer ?? ""} onChange={(e) => setCert(i, "issuer", e.target.value)} aria-label="Issuer" />
                    <input className="input" placeholder="Verification link (Credly), optional" value={c.url ?? ""} onChange={(e) => setCert(i, "url", e.target.value)} aria-label="Verification link" />
                    <button type="button" className="btn sm ghost" onClick={() => setCerts(certs.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside>
          <div className="panel">
            <h2>Photo</h2>
            {avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="thumb-preview" style={{ aspectRatio: "1", maxWidth: 160 }} />
            )}
            <div className="row">
              <label className="btn sm" style={{ cursor: "pointer" }}>
                {busy === "avatar" ? "Uploading…" : avatar ? "Replace photo" : "Upload photo"}
                <input type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0], "avatar")} />
              </label>
              {avatar && <button type="button" className="btn sm ghost" onClick={() => setAvatar("")}>Remove</button>}
            </div>
          </div>

          <div className="panel">
            <h2>Resume</h2>
            {resume && <p style={{ margin: "0 0 10px", fontSize: 13.5 }}><a className="accent" href={resume} target="_blank" rel="noopener">Current PDF</a></p>}
            <label className="btn sm" style={{ cursor: "pointer" }}>
              {busy === "resume" ? "Uploading…" : "Upload new PDF"}
              <input type="file" accept="application/pdf" hidden onChange={(e) => upload(e.target.files?.[0], "resume")} />
            </label>
          </div>

          <div className="panel">
            <h2>Links</h2>
            <div className="field"><label htmlFor="linkedin_url">LinkedIn</label><input id="linkedin_url" name="linkedin_url" className="input" defaultValue={s.linkedin_url ?? ""} /></div>
            <div className="field"><label htmlFor="github_url">GitHub</label><input id="github_url" name="github_url" className="input" defaultValue={s.github_url ?? ""} placeholder="https://github.com/…" /></div>
            <div className="field"><label htmlFor="medium_url">Medium</label><input id="medium_url" name="medium_url" className="input" defaultValue={s.medium_url ?? ""} /></div>
            <div className="field">
              <label htmlFor="email">Public email</label>
              <input id="email" name="email" type="email" className="input" defaultValue={s.email ?? ""} placeholder="Leave empty to hide" />
              <span className="hint">Shown on the site. Leave empty to use LinkedIn only.</span>
            </div>
          </div>

          <div className="panel">
            <h2>Accent colour</h2>
            <div className="row">
              <input type="color" name="accent" defaultValue={s.accent} aria-label="Accent colour" style={{ width: 48, height: 36, border: 0, background: "none" }} />
              <span className="hint">Used for buttons and links.</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="sticky-actions">
        <button className="btn primary" disabled={pending || !!busy}>{pending ? "Saving…" : "Save settings"}</button>
      </div>
    </form>
  );
}
