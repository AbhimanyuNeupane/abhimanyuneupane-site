import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap notfound">
      <p className="label" style={{ margin: "0 0 14px" }}>404</p>
      <h1>This page doesn&apos;t exist.</h1>
      <p className="muted" style={{ margin: "0 0 28px", fontSize: 19 }}>It may have moved when the site was rebuilt. All the writing is still here.</p>
      <div className="row">
        <Link href="/blog" className="btn primary">Browse posts</Link>
        <Link href="/" className="btn">Go home</Link>
      </div>
    </div>
  );
}
