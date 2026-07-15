'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { about } from '@/lib/content';

import { useState, useEffect, useRef } from 'react';
const ease = [0.16, 1, 0.3, 1] as const;

// lottie-react + the animation JSON (168KB) are only needed once this section
// is actually scrolled into view — About is one of the last sections on the
// page, so loading both eagerly on every page load was pure waste for anyone
// who doesn't scroll that far.
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

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

  // State to hold the animation data
    const [animationData, setAnimationData] = useState<any>(null);
    const [inView, setInView] = useState(false);
    const animRef = useRef<HTMLDivElement>(null!);

    // Only start loading the Lottie JSON once the section is about to be
    // visible, not the moment the homepage mounts.
    useEffect(() => {
      const el = animRef.current;
      if (!el || typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: '400px 0px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (!inView) return;
      fetch('/watch_sample2.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => setAnimationData(data))
        .catch((error) => console.error('Error loading animation:', error));
    }, [inView]);
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
          <div className="lg:col-span-8">
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

          <div className="lg:col-span-4 flex items-center justify-center">
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

            {/* animation */}
            <div ref={animRef} className='w-full max-w-[400px]'>
                      {animationData ? (
                        <div className="flex items-center justify-center max-w-full">
                          <Lottie 
                            animationData={animationData} 
                            loop={true} 
                            autoplay={true}
                            style={{ 
                              width: '100%', 
                              maxWidth: '300px',
                              height: 'auto',
                              maxHeight: '300px'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-gray-400 animate-pulse">
                          Loading Animation...
                        </div>
                      )}
                    </div>
          </div>
        </div>
      </div>
    </section>
  );
}
