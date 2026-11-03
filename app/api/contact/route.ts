import { NextResponse } from 'next/server';
import { identity } from '@/lib/content';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  // Only bots fill this hidden field. They get a normal reply so they don't try again.
  if (body.company) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 200).replace(/[\r\n]+/g, ' ');
  const message = clean(body.message, 5000);
  if (!name || !EMAIL.test(email) || !subject || !message) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('Contact form: RESEND_API_KEY is not set');
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // onboarding@resend.dev only delivers to the Resend account's own address.
      // Set CONTACT_FROM once a domain is verified there.
      from: process.env.CONTACT_FROM ?? 'Portfolio <onboarding@resend.dev>',
      to: [identity.email],
      reply_to: email,
      subject: `Portfolio: ${subject}`,
      text: `${message}\n\n${name} <${email}>`,
    }),
  }).catch(() => null);

  if (!response?.ok) {
    console.error('Contact form: Resend replied', response?.status, await response?.text());
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
