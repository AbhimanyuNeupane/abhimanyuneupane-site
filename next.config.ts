import type { NextConfig } from "next";

const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nztobuxccpkfigmxqqmb.supabase.co").replace(/\/$/, "");

// Inline scripts/styles stay allowed: Next.js hydration, the pre-paint theme script and the accent <style> need them,
// and nonces would force every page to render dynamically. Everything else is locked to this site and Supabase.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // Posts embed a few third-party diagrams, so images may come from any HTTPS host.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${supabase} ${supabase.replace(/^https/, "wss")}`,
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Old WordPress URLs
      { source: "/:y(\\d{4})/:m(\\d{2})/:d(\\d{2})/:slug/:page(\\d+)", destination: "/:y/:m/:d/:slug", permanent: true },
      { source: "/category/windowsserver", destination: "/blog?category=windows-server", permanent: true },
      { source: "/category/:cat", destination: "/blog?category=:cat", permanent: true },
      { source: "/author/:name", destination: "/#about", permanent: true },
      { source: "/feed", destination: "/feed.xml", permanent: true },
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/resume", destination: "/#experience", permanent: true },
      { source: "/wp-admin", destination: "/admin", permanent: false },
      { source: "/wp-login.php", destination: "/admin", permanent: false },
    ];
  },
};

export default nextConfig;
