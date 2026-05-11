'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects, type Project } from '@/lib/content';

const ease = [0.16, 1, 0.3, 1] as const;

function BentoCard({ project, index }: { project: Project; index: number }) {
  const isLarge = project.size === 'lg';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease, delay: index * 0.08 }}
      className={`bento-card group ${
        isLarge ? 'md:col-span-2' : 'md:col-span-1'
      } flex flex-col`}
    >
      {/* Top visual band */}
      <div
        className={`relative w-full overflow-hidden ${
          isLarge ? 'aspect-[21/9]' : 'aspect-[16/10]'
        }`}
        style={{ background: project.accent }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full border border-white/30 mix-blend-overlay"
          aria-hidden
        />
        <div className="absolute left-4 sm:left-6 top-4 sm:top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
          {project.index} / {project.category}
        </div>
        <div className="absolute right-4 sm:right-6 top-4 sm:top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
          {project.year}
        </div>
        {/* Big glyph */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05, rotate: 8 }}
            transition={{ duration: 0.5, ease }}
            className={`font-display text-white/90 ${
              isLarge ? 'text-8xl md:text-9xl' : 'text-6xl md:text-7xl'
            }`}
          >
            {project.glyph}
          </motion.div>
        </div>
        {/* Title overlay */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-end justify-between">
          <div>
            <div
              className={`font-display text-white leading-tight ${
                isLarge ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
              }`}
            >
              {project.title}
            </div>
            <div className="mt-0.5 text-[11px] sm:text-xs text-white/70">
              {project.client}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 noise" aria-hidden />
      </div>

      {/* Content band */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
          Impact
        </div>
        <p className="mt-2 text-[14px] sm:text-[15px] leading-relaxed text-[var(--fg)] text-pretty">
          {project.impact}
        </p>

        <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--fg-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 sm:mt-6 flex items-center justify-between border-t border-dashed border-[var(--border)] pt-4">
          <Link
            href={project.href ?? `/projects#${project.slug}`}
            className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-[var(--fg)]"
          >
            View Project
            <ArrowUpRight
              size={14}
              strokeWidth={1.75}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
            {project.index}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function Work() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="work" className="relative">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 py-20 md:py-32">
        <div className="flex items-end justify-between border-t border-[var(--border)] py-8 sm:py-10">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
            <span className="inline-block h-px w-8 bg-[var(--fg-muted)]" />
            <span>Selected Work</span>
          </div>
          <div className="hidden text-right text-sm text-[var(--fg-muted)] md:block">
            {featured.length} featured. {projects.length - featured.length} more shipped.
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease }}
          className="mb-10 sm:mb-12 font-display text-[clamp(2.25rem,6vw,5rem)] tracking-tightest leading-[0.95] text-balance"
        >
          Work that has shipped,
          <br />
          <em className="italic text-[var(--fg-muted)]">measured in outcomes.</em>
        </motion.h2>

        {/* 2-col bento; lg cards span both cols */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
          {featured.map((p, i) => (
            <BentoCard key={p.slug} project={p} index={i} />
          ))}
        </div>

        {/* View Full Catalog CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="mt-10 sm:mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 md:flex-row md:items-center"
        >
          <p className="max-w-md text-sm text-[var(--fg-muted)]">
            A full archive of {projects.length} production engagements — fintech, SaaS, commerce, and editorial.
          </p>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-all hover:-translate-y-0.5"
          >
            View Full Catalog
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
