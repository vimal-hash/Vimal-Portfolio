'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

// Lazy-load the 3D Showcase. The R3F/three/drei bundle is ~400KB gzipped — by
// deferring it, the page becomes interactive faster on every device, and the
// initial HTML/CSS render is no longer blocked by 3D bundle parsing.
//
// ssr:false is required because the Canvas needs `window` / WebGL on mount.
const Showcase = dynamic(() => import('./showcase'), {
  ssr: false,
  loading: () => <HeroPlaceholder />,
});

// Minimal placeholder shown while the 3D bundle downloads/parses.
// Background matches the scene's #000 so there's no flash.
function HeroPlaceholder() {
  return (
    <div
      className="relative h-[100svh] w-full"
      style={{ background: '#000' }}
      aria-hidden
    />
  );
}

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
