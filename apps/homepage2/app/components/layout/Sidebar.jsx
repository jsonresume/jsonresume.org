import Link from 'next/link';

export function Sidebar() {
  return (
    <aside id="sidebar">
      <Link href="/">Home</Link>
      <Link href="/getting-started/">Getting Started</Link>
      <Link href="/cli/">CLI Tools</Link>
      <Link href="/schema/">Schema</Link>
      <Link href="/themes/">Themes</Link>
      <Link href="/projects/">Projects</Link>
      <Link href="/ai/">AI</Link>
      <Link href="/team/">Team</Link>
      <Link href="https://docs.jsonresume.org" target="_blank">
        Docs
      </Link>
      <Link href="/blog/">Blog</Link>
    </aside>
  );
}
