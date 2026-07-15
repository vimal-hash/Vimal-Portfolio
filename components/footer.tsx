'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, ArrowUpRight } from 'lucide-react';
import {
  socials,
  footerCopy,
  identity,
} from '@/lib/content';

const ease = [0.16, 1, 0.3, 1] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] pt-16 sm:pt-20 pb-10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-2 gap-8 border-b border-[var(--border)] pb-10 sm:pb-12 md:grid-cols-4">
          <FooterCol
            label="Elsewhere"
            items={socials.map((s) => ({
              text: s.label,
              href: s.href,
              external: true,
            }))}
          />
          <FooterCol
            label="Direct"
            items={[
              { text: identity.email, href: `mailto:${identity.email}` },
              { text: 'Book a call', href: identity.calendarUrl },
            ]}
          />
          <FooterCol
            label="Documents"
            items={[
              {
                text: 'Download Resume (PDF)',
                href: identity.resumePath,
                icon: 'download',
              },
              { text: 'View full catalog', href: '/projects' },
            ]}
          />
          {/* <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-subtle)]">
              Local Time
            </div>
            <div className="mt-3 font-display text-2xl tabular text-[var(--fg)]">
              {time || '—'}
            </div>
            <div className="mt-1 text-xs text-[var(--fg-muted)]">
              {identity.basedIn} · {identity.timezone}
            </div>
          </div> */}
        </div>

        {/* Remote & Relocation — vital for UK/US hiring managers */}
        <div className="border-b border-[var(--border)] py-6 text-sm">
          {/* <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-subtle)] mr-3">
            Hiring
          </span> */}
          <span className="text-[var(--fg)]">
            {footerCopy.taglineRelocation}
          </span>
        </div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease }}
          className="select-none py-10 sm:py-12"
        >
          <div className="font-display text-[clamp(3.5rem,18vw,16rem)] leading-[0.85] tracking-tightest">
            {identity.name}
            <em className="italic text-[var(--fg-muted)]">.</em>
          </div>
        </motion.div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--fg-muted)] md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {footerCopy.taglineActive}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
            <span>{footerCopy.copyright}</span>
            {/* <span className="font-mono">{footerCopy.buildTag}</span> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  label, items,
}: {
  label: string;
  items: { text: string; href: string; external?: boolean; icon?: string }[];
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-subtle)]">
        {label}
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((it) => {
          const isInternal = it.href.startsWith('/') && !it.icon;
          const Comp: any = isInternal ? Link : 'a';
          return (
            <li key={it.text}>
              <Comp
                href={it.href}
                {...(it.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="link-underline group inline-flex items-center gap-1.5 text-sm text-[var(--fg)]"
              >
                {it.text}
                {it.icon === 'download' ? (
                  <Download size={12} strokeWidth={1.5} />
                ) : it.external ? (
                  <ArrowUpRight size={12} strokeWidth={1.5} />
                ) : null}
              </Comp>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
