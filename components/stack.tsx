'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { stackGroups, stats } from '@/lib/content';

const ease = [0.16, 1, 0.3, 1] as const;

export function Stack() {
  return (
    <section
      id="stack"
      className="relative border-t border-[var(--border)] py-20 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          <span className="inline-block h-px w-8 bg-[var(--fg-muted)]" />
          <span>Expertise & Durability</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease }}
          className="mt-6 font-display text-[clamp(2.25rem,6vw,5rem)] tracking-tightest leading-[0.95] text-balance"
        >
          Tools chosen for
          <br />
          <em className="italic text-[var(--fg-muted)]">production durability.</em>
        </motion.h2>

        {/* Impact stats */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-y-10 sm:gap-y-12 gap-x-8 md:grid-cols-3 md:gap-x-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease, delay: i * 0.1 }}
              className="border-t border-[var(--border)] pt-6"
            >
              <div className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] tracking-tightest tabular text-[var(--fg)]">
                {s.value}
              </div>
              <div className="mt-4 max-w-[28ch] text-base leading-relaxed text-[var(--fg-muted)] text-pretty">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stack groups */}
        <div className="mt-20 md:mt-32 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
              <span className="inline-block h-px w-8 bg-[var(--fg-muted)]" />
              <span>Stack — by impact</span>
            </div>
            <h3 className="mt-6 font-display text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight text-balance">
              I don&apos;t collect tools.{' '}
              <em className="italic text-[var(--fg-muted)]">
                I select for shipping.
              </em>
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--fg-muted)]">
              Each tool below earned its place by surviving production —
              measured against speed, maintainability, and the calibre of its
              ecosystem.
            </p>
          </div>

          <div className="lg:col-span-8">
            {Object.entries(stackGroups).map(([group, items], gi) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease, delay: gi * 0.08 }}
                className="border-t border-[var(--border)] py-8 sm:py-10 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline justify-between">
                  <h4 className="font-display text-xl sm:text-2xl tracking-tight">
                    {group}
                  </h4>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
                    0{gi + 1}
                  </span>
                </div>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                  {items.map((item) => (
                    <li
                      key={item.name}
                      className="group flex items-baseline justify-between border-b border-dashed border-[var(--border)] py-3 transition-colors hover:border-[var(--fg)]"
                    >
                      <span className="text-[14px] sm:text-[15px] text-[var(--fg)]">
                        {item.name}
                      </span>
                      <span className="font-mono text-xs text-[var(--fg-muted)] tabular">
                        {item.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
