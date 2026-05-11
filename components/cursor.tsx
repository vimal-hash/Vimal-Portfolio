'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    // Strict: only desktop with real cursor + not coarse pointer (no touch)
    const canHover =
      window.matchMedia('(hover: hover)').matches &&
      window.matchMedia('(pointer: fine)').matches;
    if (!canHover) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ translateX: sx, translateY: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] mix-blend-difference"
      aria-hidden
    />
  );
}
