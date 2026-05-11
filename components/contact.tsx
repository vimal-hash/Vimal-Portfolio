'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { contact } from '@/lib/content';

const ease = [0.16, 1, 0.3, 1] as const;

export function Contact() {
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Replace with real API call (Resend/Postmark/etc)
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative border-t border-[var(--border)] py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">
              <span className="inline-block h-px w-8 bg-[var(--fg-muted)]" />
              <span>{contact.eyebrow}</span>
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
              <em className="italic text-[var(--fg-muted)]">
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
              {/* <a
                href={contact.calendarUrl}
                className="link-underline block text-[var(--fg-muted)]"
              >
                Book an introductory call →
              </a> */}
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Premium success state: form fades out, message fades in */}
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
                    placeholder="A few sentences about scope, timeline, and stack."
                    required
                    multiline
                  />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                    {/* <p className="text-xs text-[var(--fg-subtle)] max-w-[32ch]">
                      Submitting sends a direct email — no CRM, no tracking.
                    </p> */}
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
        className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-subtle)]"
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
