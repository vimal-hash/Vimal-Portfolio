'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/content';

const ease = [0.16, 1, 0.3, 1] as const;

export function ProjectsCatalogue() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24">
      <Link
        href="/"
        className="link-underline inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to portfolio
      </Link>

      <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
        <span className="inline-block h-px w-8 bg-[var(--fg-muted)]" />
        <span>Catalogue — {projects.length} projects</span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="mt-6 font-display text-[clamp(2.25rem,7vw,6rem)] leading-[0.95] tracking-tightest text-balance"
      >
        The full archive,
        <br />
        <em className="italic text-[var(--fg-muted)]">end-to-end ownership.</em>
      </motion.h1>

      <p className="mt-6 max-w-xl text-base text-[var(--fg-muted)]">
        Every project below shipped to production. Each line is a problem
        solved, a metric moved, or a system designed to keep its shape
        under load.
      </p>

      <div className="mt-12 sm:mt-16 border-t border-[var(--border)]">
        {projects.map((p, i) => (
          <motion.div
            key={p.slug}
            id={p.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease, delay: i * 0.04 }}
            className="group grid grid-cols-1 gap-4 border-b border-[var(--border)] py-6 sm:py-8 transition-colors hover:bg-[var(--surface-hover)] md:grid-cols-12 md:gap-6 md:py-10 md:px-4"
          >
            <div className="md:col-span-1 font-mono text-xs text-[var(--fg-subtle)]">
              {p.index}
            </div>
            <div className="md:col-span-4">
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl tracking-tight">
                {p.title}
              </h2>
              <div className="mt-1 text-sm text-[var(--fg-muted)]">
                {p.client} · {p.year}
              </div>
            </div>
            <div className="md:col-span-5">
              <p className="text-[14px] sm:text-[15px] leading-relaxed text-[var(--fg-muted)] text-pretty">
                {p.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--fg-muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex items-start justify-end">
              <a
                href={p.href ?? '#'}
                className="link-underline inline-flex items-center gap-1.5 text-sm text-[var(--fg)]"
              >
                Open <ArrowUpRight size={12} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 sm:mt-16 flex flex-col items-start gap-4 border-t border-[var(--border)] pt-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md text-sm text-[var(--fg-muted)]">
          Have a project that needs the same level of care? Let&apos;s talk.
        </p>
        <Link
          href="/#contact"
          className="group inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-all hover:-translate-y-0.5"
        >
          Start a conversation
          <ArrowUpRight
            size={16}
            strokeWidth={1.75}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
