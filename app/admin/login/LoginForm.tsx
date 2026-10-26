"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  async function google() {
    setBusy(true);
    setOauthError(null);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/admin` },
    });
    if (error) {
      setOauthError(error.message.includes("not enabled") ? "Google sign-in isn't switched on in Supabase yet." : error.message);
      setBusy(false);
    }
  }

  return (
    <>
      {oauthError && <div className="notice err">{oauthError}</div>}
      <button className="btn primary" onClick={google} disabled={busy}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.68 3.7 14.55 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25c5.34 0 8.88-3.75 8.88-9.04 0-.6-.06-1.06-.14-1.51Z"/></svg>
        {busy ? "Redirecting to Google…" : "Continue with Google"}
      </button>
    </>
  );
}
