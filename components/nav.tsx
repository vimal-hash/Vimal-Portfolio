'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { navLinks, identity } from '@/lib/content';

export function Nav() {
  // White text only works over the black hero, which only the home page has.
  const hasHero = usePathname() === '/';
  const [pastHero, setPastHero] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { scrollY } = useScroll();

  const update = React.useCallback((y: number) => {
    setScrolled(y > 24);
    setPastHero(y >= window.innerHeight * 0.85);
  }, []);

  useMotionValueEvent(scrollY, 'change', update);
  React.useEffect(() => update(window.scrollY), [update]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const overHero = hasHero && !pastHero && !open;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        // Live blur on a fixed header is expensive while scrolling, so phones get a flat tint.
        open
          ? 'border-b border-[var(--border)] bg-[var(--bg)]'
          : overHero
            ? scrolled
              ? 'border-b border-white/10 bg-black/30 max-md:bg-black/70 md:backdrop-blur-md'
              : 'border-b border-transparent'
            : 'border-b border-[var(--border)] [background:color-mix(in_srgb,var(--bg)_72%,transparent)] max-md:[background:color-mix(in_srgb,var(--bg)_95%,transparent)] md:backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-10">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={cn(
            'group flex items-center gap-2.5 text-sm tracking-tight transition-colors',
            overHero ? 'text-white' : 'text-[var(--fg)]',
          )}
        >
          <span>
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
                overHero ? 'text-white/70 hover:text-white' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]',
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
                : 'border-[var(--fg)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]',
            )}
          >
            {identity.availability}
            <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </Link>
          <ThemeToggle invert={overHero} />
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center md:hidden',
              overHero ? 'text-white' : 'text-[var(--fg)]',
            )}
          >
            {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-[var(--border)] px-4 pb-5 pt-2 sm:px-6 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-lg text-[var(--fg)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </motion.header>
  );
}
