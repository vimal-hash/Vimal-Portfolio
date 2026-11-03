import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
        404
      </div>
      <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tightest">
        Page not found.
      </h1>
      <p className="max-w-md text-[var(--fg-muted)]">
        This page has moved or doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3 text-sm font-medium text-[var(--bg)] hover:-translate-y-0.5 transition-transform"
      >
        Back to the homepage
      </Link>
    </main>
  );
}
