'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/content';
import { Work } from '@/components/work';
import { hasWebGL2, WebGLBoundary } from '@/components/webgl-boundary';
import { useTheme } from '@/components/theme-provider';
import type { GalleryMotion } from './config';

const Scene = dynamic(() => import('./scene'), { ssr: false });

// Scroll distance per project, and the hold before the first and after the last.
const STEP_SVH = 120;
const HOLD_SVH = 15;

// Text over the scene crosses both grey wall and white light bars, so it brings its own backing.
const CHIP = 'rounded-[1.25rem] bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] text-[var(--fg)]';

const smoother = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

function canRunGallery() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;
  return hasWebGL2();
}

export function WorkGallery() {
  const items = React.useMemo(() => projects.filter((p) => p.featured), []);
  const n = items.length;

  const [fallback, setFallback] = React.useState(false);
  const [near, setNear] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [lite, setLite] = React.useState(false);
  const [active, setActive] = React.useState(0);

  const { resolvedTheme } = useTheme();
  const sectionRef = React.useRef<HTMLElement>(null);
  const motionRef = React.useRef<GalleryMotion>({ target: 0, enter: 0, pointerX: 0, pointerY: 0, dark: false });
  const isDark = resolvedTheme === 'dark';
  motionRef.current.dark = isDark;

  React.useEffect(() => {
    if (!canRunGallery()) {
      setFallback(true);
      return;
    }
    setLite(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
  }, []);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section || fallback) return;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = rect.height - vh;
      const hold = (HOLD_SVH / 100) * vh;
      const scrolled = Math.min(span, Math.max(0, -rect.top));
      const raw = Math.min(1, Math.max(0, (scrolled - hold) / Math.max(1, span - hold * 2))) * (n - 1);
      const base = Math.min(Math.floor(raw), Math.max(0, n - 2));
      // Whole numbers dwell, so each project rests on screen while scrolling stays native.
      const p = base + smoother(0.2, 0.8, raw - base);
      motionRef.current.target = p;
      motionRef.current.enter = Math.min(1, Math.max(0, 1 - rect.top / vh));
      setActive(Math.round(p));
    };
    const onPointer = (e: PointerEvent) => {
      motionRef.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      motionRef.current.pointerY = 1 - (e.clientY / window.innerHeight) * 2;
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', onPointer, { passive: true });

    // Load the scene well before it arrives, and only draw it while it is on screen.
    const nearObserver = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '120% 0px' });
    const viewObserver = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    nearObserver.observe(section);
    viewObserver.observe(section);

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onPointer);
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [fallback, n]);

  const goTo = React.useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const hold = (HOLD_SVH / 100) * vh;
      const span = rect.height - vh;
      const top = window.scrollY + rect.top + hold + (index / Math.max(1, n - 1)) * (span - hold * 2);
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [n],
  );

  const onSelect = React.useCallback(
    (index: number) => {
      if (index !== Math.round(motionRef.current.target)) {
        goTo(index);
        return;
      }
      const href = items[index]?.href;
      if (href) window.open(href, '_blank', 'noopener,noreferrer');
    },
    [goTo, items],
  );

  const onReady = React.useCallback(() => setReady(true), []);
  const onSceneError = React.useCallback(() => setFallback(true), []);

  if (fallback) return <Work />;

  const project = items[active];

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-labelledby="work-heading"
      className="relative"
      style={{ height: `calc(100svh + ${(n - 1) * STEP_SVH + HOLD_SVH * 2}svh)` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Stands in for the room until the scene fades in, and for visitors without JavaScript. */}
        <div
          aria-hidden
          className={`absolute inset-0 ${isDark ? 'bg-[#141516]' : 'bg-[#d6d9d9]'}`}
          style={{
            backgroundImage:
              'linear-gradient(90deg, transparent 17%, rgba(255,255,255,.95) 21%, rgba(255,255,255,.95) 29%, transparent 33%, transparent 67%, rgba(255,255,255,.95) 71%, rgba(255,255,255,.95) 79%, transparent 83%)',
          }}
        />

        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          {near && (
            <WebGLBoundary onError={onSceneError}>
              <Scene projects={items} motion={motionRef} lite={lite} active={inView} onReady={onReady} onSelect={onSelect} />
            </WebGLBoundary>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-20 sm:top-24" aria-hidden>
          <div className="mx-auto flex max-w-[1400px] justify-end px-4 tabular text-xs uppercase tracking-[0.2em] sm:px-6 md:px-10">
            <span className={`${CHIP} px-3 py-1.5`}>
              {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-6 sm:pb-8 md:pb-10" aria-hidden>
          {/* Card text gets small on a phone, so the facts are repeated here at a readable size. */}
          <div className="mb-4 flex justify-center px-4 text-center md:hidden">
            <div className={`${CHIP} px-4 py-2`}>
              {project.highlight && <div className="text-sm font-medium [@media(max-height:480px)]:hidden">{project.highlight}</div>}
              <div className="text-xs">
                {[project.category, project.location, project.year].filter(Boolean).join(' / ')}
              </div>
            </div>
          </div>
          {/* The catalog link sits last, so it stays put when a project has no link of its own. */}
          <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-6 px-4 sm:px-6 md:justify-end md:px-10">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                className="group pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-transform hover:-translate-y-0.5"
              >
                View Project
                <ArrowUpRight size={15} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            <Link href="/projects" tabIndex={-1} className={`${CHIP} pointer-events-auto px-5 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5`}>
              View Full Catalog
            </Link>
          </div>
        </div>

        {/* The real content for keyboards, screen readers and crawlers. Focus moves the carousel. */}
        <h2 id="work-heading" className="sr-only">A few things I've built.</h2>
        <ul>
          {items.map((p, i) => (
            <li key={p.slug}>
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onFocus={() => goTo(i)}
                  className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-20 focus:z-20 focus:rounded-full focus:bg-[var(--fg)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--bg)]"
                >
                  {p.title}: {p.category}, {p.location}. {p.impact}
                </a>
              ) : (
                <span className="sr-only">
                  {p.title}: {p.category}, {p.location}. {p.impact}
                </span>
              )}
            </li>
          ))}
          <li>
            <Link
              href="/projects"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-20 focus:z-20 focus:rounded-full focus:bg-[var(--fg)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--bg)]"
            >
              View Full Catalog
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
