"use client";

import { useRef, useState } from "react";
import { uploadMedia } from "./upload";

export default function Uploader({
  label,
  accept = "image/*",
  folder,
  onUploaded,
}: {
  label: string;
  accept?: string;
  folder?: string;
  onUploaded: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErr("That file is over 10 MB. Compress it and try again.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      onUploaded(await uploadMedia(file, folder ?? "uploads"));
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <>
      <input ref={ref} type="file" accept={accept} hidden onChange={onChange} />
      <button type="button" className="btn sm" onClick={() => ref.current?.click()} disabled={busy}>
        {busy ? "Uploading…" : label}
      </button>
      {err && <span style={{ color: "var(--danger)", fontSize: 13 }}>{err}</span>}
    </>
  );
}
