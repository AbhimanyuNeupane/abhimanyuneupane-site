import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap notfound">
      <p className="accent" style={{ fontWeight: 600, margin: "0 0 10px" }}>404</p>
      <h1>This page doesn&apos;t exist.</h1>
      <p className="muted" style={{ margin: "0 0 28px", fontSize: 18 }}>It may have moved when the site was rebuilt. All the posts are still here.</p>
      <div className="row">
        <Link href="/blog" className="btn primary">Browse posts</Link>
        <Link href="/" className="btn">Go home</Link>
      </div>
    </div>
  );
}
