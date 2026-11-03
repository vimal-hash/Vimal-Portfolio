'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

const Showcase = dynamic(() => import('./showcase'), {
  ssr: false,
  loading: () => <HeroPlaceholder />,
});

function HeroPlaceholder() {
  return (
    <div
      className="relative h-[100svh] w-full"
      style={{ background: '#000' }}
      aria-hidden
    />
  );
}
// done
export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate"
      style={{ background: '#000' }}
    >
      <Showcase />
    </section>
  );
}
