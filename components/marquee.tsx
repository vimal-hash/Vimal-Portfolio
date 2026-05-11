'use client';

import * as React from 'react';
import { marqueePhrases } from '@/lib/content';

export function Marquee() {
  // Duplicate the array so the animation can loop seamlessly without a jump
  const items = [...marqueePhrases, ...marqueePhrases];

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-[var(--border)] py-6 md:py-10"
    >
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {items.map((p, i) => (
          <span
            key={`${p}-${i}`}
            className="mx-6 sm:mx-8 inline-flex items-center gap-6 sm:gap-8 font-display text-2xl sm:text-3xl md:text-5xl tracking-tight text-[var(--fg)]"
          >
            {p}
            <span className="text-[var(--fg-subtle)]">✦</span>
          </span>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32"
        style={{ background: 'linear-gradient(to right, var(--bg), transparent)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32"
        style={{ background: 'linear-gradient(to left, var(--bg), transparent)' }}
      />
    </section>
  );
}
