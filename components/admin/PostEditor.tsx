"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { deletePost, previewMarkdown, savePost } from "@/app/admin/actions";
import { slugify } from "@/lib/format";
import type { Post } from "@/lib/types";
import Uploader from "./Uploader";
import { uploadMedia } from "./upload";

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PostEditor({ post, categories, created }: { post?: Post; categories: string[]; created?: boolean }) {
  const [state, action, pending] = useActionState(savePost, created ? { ok: "Post created." } : null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [content, setContent] = useState(post?.content ?? "");
  const [cover, setCover] = useState(post?.cover_image ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [html, setHtml] = useState("");
  const [dirty, setDirty] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    if (tab === "preview") previewMarkdown(content).then(setHtml);
  }, [tab, content]);

  useEffect(() => {
    if (state?.ok) setDirty(false);
  }, [state]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function insert(text: string) {
    const el = area.current;
    if (!el) return setContent((c) => c + text);
    const { selectionStart: a, selectionEnd: b } = el;
    const next = content.slice(0, a) + text + content.slice(b);
    setContent(next);
    setDirty(true);
    requestAnimationFrame(() => { el.focus(); el.selectionStart = el.selectionEnd = a + text.length; });
  }

  function wrap(before: string, after = before) {
    const el = area.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const sel = content.slice(a, b) || "text";
    insert(before + sel + after);
  }

  async function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const file = [...e.clipboardData.files].find((f) => f.type.startsWith("image/"));
    if (!file) return;
    e.preventDefault();
    insert("\n![Uploading image…]()\n");
    try {
      const url = await uploadMedia(file, "posts");
      setContent((c) => c.replace("![Uploading image…]()", `![](${url})`));
    } catch {
      setContent((c) => c.replace("![Uploading image…]()", ""));
    }
  }

  return (
    <form action={action} onChange={() => setDirty(true)}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="cover_image" value={cover} />

      {state?.ok && <div className="notice ok">{state.ok}</div>}
      {state?.error && <div className="notice err">{state.error}</div>}

      <div className="form-grid">
        <div>
          <div className="field">
            <label htmlFor="title" className="sr-only">Title</label>
            <input id="title" name="title" className="input title-input" placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="excerpt">Summary</label>
            <textarea id="excerpt" name="excerpt" className="textarea" style={{ minHeight: 70 }} defaultValue={post?.excerpt ?? ""} placeholder="One or two sentences shown on the homepage, in search results and in link previews." />
          </div>

          <div className="tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === "write"} className={tab === "write" ? "on" : ""} onClick={() => setTab("write")}>Write</button>
            <button type="button" role="tab" aria-selected={tab === "preview"} className={tab === "preview" ? "on" : ""} onClick={() => setTab("preview")}>Preview</button>
          </div>

          {tab === "write" ? (
            <>
              <div className="row" style={{ marginBottom: 8 }}>
                <button type="button" className="btn sm" onClick={() => insert("\n## ")}>Heading</button>
                <button type="button" className="btn sm" onClick={() => wrap("**")}>Bold</button>
                <button type="button" className="btn sm" onClick={() => wrap("`")}>Code</button>
                <button type="button" className="btn sm" onClick={() => wrap("\n```\n", "\n```\n")}>Code block</button>
                <button type="button" className="btn sm" onClick={() => wrap("[", "](https://)")}>Link</button>
                <button type="button" className="btn sm" onClick={() => insert("\n> **Note:** ")}>Note</button>
                <Uploader label="Insert image" folder="posts" onUploaded={(u) => insert(`\n![](${u})\n`)} />
              </div>
              <textarea
                ref={area}
                className="textarea editor"
                value={content}
                onChange={(e) => { setContent(e.target.value); setDirty(true); }}
                onPaste={onPaste}
                placeholder={"Write in Markdown.\n\n## A heading\n\nSome text with **bold** and `inline code`.\n\nPaste a screenshot straight in and it uploads automatically."}
                spellCheck
              />
            </>
          ) : (
            <div className="preview prose" dangerouslySetInnerHTML={{ __html: html || "<p class='muted'>Nothing to preview yet.</p>" }} />
          )}
        </div>

        <aside>
          <div className="panel">
            <h2>Publishing</h2>
            <label className="toggle" style={{ marginBottom: 14 }}>
              <input type="checkbox" name="published" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              {published ? "Published on the site" : "Draft (only you can see it)"}
            </label>
            <div className="field">
              <label htmlFor="published_at">Publish date</label>
              <input id="published_at" name="published_at" type="datetime-local" className="input" defaultValue={toLocalInput(post?.published_at ?? null)} />
              <span className="hint">Leave empty to use the moment you publish. The date is part of the post&apos;s URL.</span>
            </div>
            <div className="row">
              <button className="btn primary" type="submit" disabled={pending}>
                {pending ? "Saving…" : published ? (post?.published ? "Save changes" : "Publish") : "Save draft"}
              </button>
            </div>
          </div>

          <div className="panel">
            <h2>Details</h2>
            <div className="field">
              <label htmlFor="slug">URL slug</label>
              <input id="slug" name="slug" className="input" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} />
              {post?.published && <span className="hint">Changing this breaks links people have already shared.</span>}
            </div>
            <div className="field">
              <label htmlFor="category">Category</label>
              <input id="category" name="category" className="input" list="cats" defaultValue={post?.category ?? ""} placeholder="CyberArk, Network…" />
              <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="field">
              <label htmlFor="tags">Tags</label>
              <input id="tags" name="tags" className="input" defaultValue={post?.tags?.join(", ") ?? ""} placeholder="PSM, AutoIt" />
              <span className="hint">Separate with commas.</span>
            </div>
          </div>

          <div className="panel">
            <h2>Cover image</h2>
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="thumb-preview" />
            )}
            <div className="row">
              <Uploader label={cover ? "Replace" : "Upload cover"} folder="covers" onUploaded={(u) => { setCover(u); setDirty(true); }} />
              {cover && <button type="button" className="btn sm ghost" onClick={() => { setCover(""); setDirty(true); }}>Remove</button>}
            </div>
          </div>
        </aside>
      </div>

      {post && (
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
          <button
            type="submit"
            formAction={deletePost}
            formNoValidate
            className="btn danger sm"
            onClick={(e) => { if (!window.confirm(`Delete "${post.title}" permanently?`)) e.preventDefault(); }}
          >
            Delete post
          </button>
        </div>
      )}
    </form>
  );
}
