"use client";

import { useState } from "react";

/**
 * Shows the address only after a click. The page HTML carries it base64-encoded,
 * so simple scrapers that grep for "@" never see it.
 */
export default function RevealEmail({ encoded, icon }: { encoded: string; icon?: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);

  if (email) {
    return <a href={`mailto:${email}`} className="btn">{icon} {email}</a>;
  }
  return (
    <button type="button" className="btn" onClick={() => setEmail(atob(encoded))}>
      {icon} Reveal my email
    </button>
  );
}
