import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Auto-generated and self-healing, powered by Docwright.
      </p>
      <Link
        href="/docs"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Read the Docs
      </Link>
    </main>
  );
}
