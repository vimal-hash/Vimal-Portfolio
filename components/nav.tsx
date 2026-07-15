'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { navLinks, identity } from '@/lib/content';

export function Nav() {
  // Two states: "over hero" (transparent bg, white text) and "scrolled"
  // (theme-aware bg + text). Threshold = 1 viewport height roughly.
  const [overHero, setOverHero] = React.useState(true);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
    // Switch to theme colors after we've passed the hero (~80vh is enough)
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    setOverHero(latest < vh * 0.85);
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        // backdrop-blur is skipped on small/touch screens: it forces the
        // browser to re-blur whatever's scrolling behind this fixed header
        // on every single scroll frame, which is one of the most common
        // causes of scroll jank on mobile GPUs. Desktop keeps the frosted
        // look; mobile gets a more opaque flat tint instead (no live blur).
        scrolled && !overHero
          ? 'border-b border-[var(--border)] bg-[var(--bg)]/70 md:backdrop-blur-xl max-md:bg-[var(--bg)]/95'
          : scrolled && overHero
            ? 'bg-black/30 md:backdrop-blur-md border-b border-white/10 max-md:bg-black/70'
            : 'border-b border-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-10">
        <Link
          href="/"
          className={cn(
            'group flex items-center gap-2.5 text-sm tracking-tight transition-colors',
            overHero ? 'text-white' : 'text-[var(--fg)]'
          )}
        >
          {/* <span className="font-display text-xl italic">{identity.initial}.</span> */}
          <span className="hidden sm:inline-block">
            {identity.name}
            <span className={overHero ? 'text-white/60' : 'text-[var(--fg-muted)]'}>
              {' '}
              - {identity.role}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'link-underline text-sm transition-colors',
                overHero
                  ? 'text-white/70 hover:text-white'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#contact"
            className={cn(
              'hidden h-9 items-center rounded-full border px-4 text-xs font-medium tracking-wide transition-all sm:inline-flex',
              overHero
                ? 'border-white text-white hover:bg-white hover:text-black'
                : 'border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]'
            )}
          >
            {identity.availability}
            <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </Link>
          <ThemeToggle invert={overHero} />
        </div>
      </div>
    </motion.header>
  );
}
