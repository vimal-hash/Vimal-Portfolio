'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { contact } from '@/lib/content';

const ease = [0.16, 1, 0.3, 1] as const;

export function Contact() {
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  // Set when sending fails: a ready-to-send email, so the visitor's message isn't lost.
  const [fallbackMail, setFallbackMail] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setSubmitting(true);
    setFallbackMail(null);
    const sent = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.ok)
      .catch(() => false);
    setSubmitting(false);
    if (sent) {
      setSubmitted(true);
      return;
    }
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(`${data.message}\n\n${data.name}`);
    setFallbackMail(`mailto:${contact.email}?subject=${subject}&body=${body}`);
  };

  return (
    <section id="contact" className="relative border-t border-[var(--border)] py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
              {contact.eyebrow}
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease }}
              className="mt-6 font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.98] tracking-tightest text-balance"
            >
              {contact.headline}
              <br />
              <em className="text-[var(--fg-muted)]">
                {contact.headlineItalic}
              </em>
            </motion.h2>

            <p className="mt-6 sm:mt-8 max-w-md text-base leading-relaxed text-[var(--fg-muted)]">
              {contact.pitch}
            </p>

            <div className="mt-8 sm:mt-10 space-y-4 text-sm">
              <a
                href={`mailto:${contact.email}`}
                className="link-underline block text-[var(--fg)] break-all"
              >
                {contact.email}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease }}
                  className="flex min-h-[400px] flex-col items-start justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease, delay: 0.2 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--fg)]"
                  >
                    <Check size={22} strokeWidth={1.5} />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.35 }}
                    className="mt-6 font-display text-3xl md:text-4xl tracking-tight"
                  >
                    {contact.successHeadline}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.5 }}
                    className="mt-3 max-w-md text-base text-[var(--fg-muted)]"
                  >
                    {contact.successBody}
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease, delay: 0.1 }}
                  onSubmit={handleSubmit}
                  className="space-y-8 sm:space-y-10"
                >
                  <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2">
                    <Field label="Name" name="name" placeholder="Your name" required />
                    <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
                  </div>
                  <Field label="Subject" name="subject" placeholder="What are you building?" required />
                  <Field
                    label="Message"
                    name="message"
                    placeholder="What do you need, and by when?"
                    required
                    multiline
                  />

                  {/* Hidden from people. Bots fill it in, and the API ignores anything that has it. */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="absolute -left-[9999px] h-px w-px opacity-0"
                  />

                  <div className="flex flex-col items-start gap-4 pt-2">
                    {fallbackMail && (
                      <p role="alert" className="max-w-md text-sm text-[var(--fg)]">
                        That didn't send.{' '}
                        <a href={fallbackMail} className="underline underline-offset-4">
                          Open it as an email instead
                        </a>
                        , your message is already filled in.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {submitting ? 'Sending…' : 'Send message'}
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.75}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, name, placeholder, type = 'text', required, multiline,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const id = `field-${name}`;
  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.22em] text-[var(--fg-subtle)]"
      >
        {label}
        {required && <span className="ml-1 text-[var(--accent)]">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          required={required}
          placeholder={placeholder}
          rows={4}
          data-lenis-prevent
          className="underline-input mt-2 resize-none"
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="underline-input mt-2"
        />
      )}
    </div>
  );
}
