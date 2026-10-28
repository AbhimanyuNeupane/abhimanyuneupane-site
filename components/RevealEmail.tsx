"use client";

import { useState } from "react";

/** "Reveal my email" shows the address as base64 and nothing more; decoding it is the visitor's little challenge. */
export default function RevealEmail({ encoded, icon }: { encoded: string; icon?: React.ReactNode }) {
  const [shown, setShown] = useState(false);

  if (shown) {
    return <code className="email-code" aria-label="My email address, base64-encoded">{encoded}</code>;
  }
  return (
    <button type="button" className="btn" onClick={() => setShown(true)}>
      {icon} Reveal my email
    </button>
  );
}
