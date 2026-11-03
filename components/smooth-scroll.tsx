'use client';

import * as React from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// The wheel glides and then settles in about half a second. Touch stays native, because
// phones already have their own momentum. The page still scrolls for real, so sticky
// sections and scroll listeners work as usual.
export function SmoothScroll() {
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.14, autoRaf: true });

    // Same-page links glide too. This runs before Next's own handler, which would jump.
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest('a') : null;
      if (!link || !link.hash || link.target === '_blank') return;
      if (link.pathname !== window.location.pathname) return;
      const target = document.querySelector(link.hash);
      if (!(target instanceof HTMLElement)) return;
      e.preventDefault();
      e.stopPropagation();
      window.history.pushState(null, '', link.hash);
      lenis.scrollTo(target, { duration: 1.2 });
    };
    document.addEventListener('click', onClick, true);

    return () => {
      document.removeEventListener('click', onClick, true);
      lenis.destroy();
    };
  }, []);

  return null;
}
