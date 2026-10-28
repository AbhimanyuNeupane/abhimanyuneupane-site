"use client";

import { useActionState, useState } from "react";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import type { Certification, Job, Schooling, Settings, ToolGroup } from "@/lib/types";
import { uploadMedia } from "./upload";

export default function SettingsForm({ s }: { s: Settings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettings, null);
  const [certs, setCerts] = useState<Certification[]>(s.certifications ?? []);
  const [jobs, setJobs] = useState<Job[]>(s.experience ?? []);
  const [schools, setSchools] = useState<Schooling[]>(s.education ?? []);
  const [tools, setTools] = useState<ToolGroup[]>(s.toolkit ?? []);
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
  const setJob = (i: number, patch: Partial<Job>) => setJobs((c) => c.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const setSchool = (i: number, patch: Partial<Schooling>) => setSchools((c) => c.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const setTool = (i: number, patch: Partial<ToolGroup>) => setTools((c) => c.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = <T,>(list: T[], i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return list;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  return (
    <form action={action}>
      <input type="hidden" name="certifications" value={JSON.stringify(certs)} />
      <input type="hidden" name="experience" value={JSON.stringify(jobs)} />
      <input type="hidden" name="education" value={JSON.stringify(schools)} />
      <input type="hidden" name="toolkit" value={JSON.stringify(tools)} />
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
              <span className="hint">The paragraph under your name on the homepage. Also used as the search-result description.</span>
            </div>
            <div className="field">
              <label htmlFor="about">About</label>
              <textarea id="about" name="about" className="textarea" style={{ minHeight: 200 }} defaultValue={s.about} />
              <span className="hint">Leave a blank line between paragraphs.</span>
            </div>
            <div className="field">
              <label htmlFor="now_text">What you&apos;re working on now</label>
              <input id="now_text" name="now_text" className="input" defaultValue={s.now_text ?? ""} placeholder="Studying for…" />
              <span className="hint">One line under About on the homepage. Leave empty to hide it.</span>
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" className="input" defaultValue={s.location ?? ""} placeholder="City, Province (optional)" />
              <span className="hint">Shown above your name and in the footer. Leave empty to hide it.</span>
            </div>
          </div>

          <div className="panel">
            <div className="row between" style={{ marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Experience</h2>
              <button type="button" className="btn sm" onClick={() => setJobs([{ role: "", org: "", place: "", start: "", end: "Present", points: [] }, ...jobs])}>Add role</button>
            </div>
            <p className="hint" style={{ margin: "0 0 12px" }}>Newest first. Use &quot;Present&quot; as the end date for your current role.</p>
            <div className="list-editor">
              {jobs.map((job, i) => (
                <div className="item" key={i}>
                  <div className="row">
                    <input className="input" placeholder="Role" value={job.role} onChange={(e) => setJob(i, { role: e.target.value })} aria-label="Role" />
                    <input className="input" placeholder="Organisation" value={job.org} onChange={(e) => setJob(i, { org: e.target.value })} aria-label="Organisation" />
                  </div>
                  <div className="row">
                    <input className="input" placeholder="City, Country" value={job.place ?? ""} onChange={(e) => setJob(i, { place: e.target.value })} aria-label="Location" />
                    <input className="input" style={{ maxWidth: 120 }} placeholder="May 2025" value={job.start} onChange={(e) => setJob(i, { start: e.target.value })} aria-label="Start" />
                    <input className="input" style={{ maxWidth: 120 }} placeholder="Present" value={job.end} onChange={(e) => setJob(i, { end: e.target.value })} aria-label="End" />
                  </div>
                  <textarea className="textarea" style={{ minHeight: 90 }} placeholder="One highlight per line" value={job.points.join("\n")} onChange={(e) => setJob(i, { points: e.target.value.split("\n") })} aria-label="Highlights" />
                  <div className="row">
                    <button type="button" className="btn sm ghost" onClick={() => setJobs(move(jobs, i, -1))} disabled={i === 0}>Move up</button>
                    <button type="button" className="btn sm ghost" onClick={() => setJobs(move(jobs, i, 1))} disabled={i === jobs.length - 1}>Move down</button>
                    <button type="button" className="btn sm ghost" onClick={() => setJobs(jobs.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="row between" style={{ marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Toolkit</h2>
              <button type="button" className="btn sm" onClick={() => setTools([...tools, { group: "", items: "" }])}>Add group</button>
            </div>
            <div className="list-editor">
              {tools.map((t, i) => (
                <div className="item" key={i}>
                  <div className="row">
                    <input className="input" style={{ maxWidth: 220 }} placeholder="Group" value={t.group} onChange={(e) => setTool(i, { group: e.target.value })} aria-label="Group" />
                    <input className="input" placeholder="Tools, separated by commas" value={t.items} onChange={(e) => setTool(i, { items: e.target.value })} aria-label="Tools" />
                    <button type="button" className="btn sm ghost" onClick={() => setTools(tools.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="row between" style={{ marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Education</h2>
              <button type="button" className="btn sm" onClick={() => setSchools([...schools, { title: "", school: "", dates: "", note: "" }])}>Add</button>
            </div>
            <div className="list-editor">
              {schools.map((ed, i) => (
                <div className="item" key={i}>
                  <div className="row">
                    <input className="input" placeholder="Programme" value={ed.title} onChange={(e) => setSchool(i, { title: e.target.value })} aria-label="Programme" />
                    <input className="input" placeholder="School" value={ed.school} onChange={(e) => setSchool(i, { school: e.target.value })} aria-label="School" />
                  </div>
                  <div className="row">
                    <input className="input" style={{ maxWidth: 140 }} placeholder="2023 – 2024" value={ed.dates ?? ""} onChange={(e) => setSchool(i, { dates: e.target.value })} aria-label="Dates" />
                    <input className="input" placeholder="Note, e.g. Dean's List (optional)" value={ed.note ?? ""} onChange={(e) => setSchool(i, { note: e.target.value })} aria-label="Note" />
                    <button type="button" className="btn sm ghost" onClick={() => setSchools(schools.filter((_, j) => j !== i))}>Remove</button>
                  </div>
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
              <span className="hint">Used sparingly for links and the current-role marker.</span>
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
