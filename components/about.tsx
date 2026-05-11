'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { about } from '@/lib/content';

const ease = [0.16, 1, 0.3, 1] as const;

// Helper: splits the headline into [before, italic, after] for styling
function splitHeadline(headline: string, italic: string) {
  const idx = headline.indexOf(italic);
  if (idx === -1) return { before: headline, italic: '', after: '' };
  return {
    before: headline.slice(0, idx),
    italic,
    after: headline.slice(idx + italic.length),
  };
}

export function About() {
  const { before, italic, after } = splitHeadline(
    about.headline,
    about.italicPhrase
  );

  return (
    <section
      id="about"
      className="relative border-t border-[var(--border)] py-20 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          <span className="inline-block h-px w-8 bg-[var(--fg-muted)]" />
          <span>About — a short note</span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-9">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease }}
              className="font-display text-[clamp(1.5rem,3.6vw,3.25rem)] leading-[1.15] tracking-tight text-balance"
            >
              {before}
              <em className="italic text-[var(--fg-muted)]">{italic}</em>
              {after}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease, delay: 0.15 }}
              className="mt-8 sm:mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-[var(--fg-muted)]"
            >
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            {/* <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease, delay: 0.25 }}
              className="space-y-6 border-l border-[var(--border)] pl-6"
            >
              {about.meta.map((m) => (
                <div key={m.label}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
                    {m.label}
                  </div>
                  <div className="mt-1 text-sm text-[var(--fg)]">{m.value}</div>
                </div>
              ))}
            </motion.div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
