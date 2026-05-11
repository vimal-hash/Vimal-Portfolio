'use client';

import * as React from 'react';
import Showcase from './showcase';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate"
      style={{ background: '#000' }}
    >
      {/* Preload critical scene assets ASAP */}
      <link
        rel="preload"
        as="fetch"
        href="/Portfolio3.glb"
        crossOrigin="anonymous"
      />
      <link rel="preload" as="image" href="/textures/floor/floor_diffuse.jpg" />
      <link rel="preload" as="image" href="/Wood/diff.webp" />
      <Showcase />
    </section>
  );
}
