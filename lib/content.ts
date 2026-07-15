/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  EDIT EVERYTHING ON THE SITE FROM THIS FILE.                    ║
 * ║                                                                  ║
 * ║  Section markers below tell you exactly what's editable and     ║
 * ║  where it appears. Save the file → the site updates.            ║
 * ║                                                                  ║
 * ║  Order matters in arrays (projects, stats, links). Reorder       ║
 * ║  here and the site reorders.                                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

/* ─────────────────────────────────────────────────────────────────── *
 * 1. IDENTITY — name, role, location, availability
 * Used in: nav, hero, about, contact, footer, metadata
 * ─────────────────────────────────────────────────────────────────── */
export const identity = {
  name: 'Vimal',
  initial: 'V',
  role: 'Frontend Engineer',
  yearsOfExperience: '4',
  basedIn: 'Chennai, India',
  timezone: 'UTC+5:30',
  // Hiring signals — UK/US hiring managers look for these
  availability: 'Available',
  remoteRelocation: 'Open to Remote',
  workingWith: 'UK & US founders',
  specialty: 'React · R3F · Performance',
  email: 'vimaloffi1@gmail.com',
  resumePath: '/resume/Vimal-may-resume.pdf',
  calendarUrl: 'https://cal.com/vimal',
  websiteUrl: 'https://vimal.dev',
} as const;

/* ─────────────────────────────────────────────────────────────────── *
 * 2. HERO — the first thing they see
 * Used in: components/showcase.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const hero = {
  // eyebrow: 'Portfolio / 2026',
  // Split into 3 parts for italic styling
  headline: {
    line1: 'Hi!',
    line1Italic: `I'm`, // rendered italic, muted
    line2: 'Vimal',
  },
  subhead:
    'Frontend engineer building immersive, high-performance web experiences. React · TypeScript · 3D.',
  primaryCta: { label: 'Get in touch', href: 'mailto:vimaloffi1@gmail.com' },
  secondaryCta: { label: 'Resume', href: '/resume/Vimal-may-resume.pdf' },
  // Meta strip under the buttons
  meta: [
    // { label: 'Available', value: 'Q3 2026' },
    // { label: 'Based', value: 'Chennai · UTC+5:30' },
    // { label: 'Working with', value: 'UK & US founders' },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────── *
 * 3. NAVIGATION — top bar links
 * Used in: components/nav.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'Stack', href: '/#stack' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
] as const;

/* ─────────────────────────────────────────────────────────────────── *
 * 4. PROJECTS — bento grid + /projects archive
 * Used in: components/work.tsx, components/projects-catalogue.tsx
 *
 * To reorder the bento grid: rearrange the array.
 * To change card sizes: set `size: 'lg' | 'sm'`.
 *   - 'lg' spans both columns (2 cols)
 *   - 'sm' spans one column
 *
 * Current bento layout (per spec):
 *   [01 Sphere — LARGE — top]
 *   [02 SaaS Landing — small ] [03 Manvasam — small]
 *   [04 Modulus Housing — LARGE — bottom]
 * ─────────────────────────────────────────────────────────────────── */
export type Project = {
  slug: string;
  index: string;
  title: string;
  client: string;
  year: string;
  category: string;
  impact: string;
  description: string;
  stack: string[];
  href?: string;
  accent: string;
  glyph?: string;
  size: 'sm' | 'lg';
  featured: boolean;
  image: string;
  bgc:string,
};

export const projects: Project[] = [
  
  // {
  //   slug: 'saas-landing',
  //   index: '02',
  //   title: 'SaaS Landing Pages',
  //   client: 'Multiple Engagements',
  //   year: '2023—2025',
  //   category: 'Marketing / SEO',
  //   impact:
  //     'Optimized SEO and Core Web Vitals to boost organic traffic by 60% across multiple SaaS clients.',
  //   description:
  //     'Conversion-focused marketing sites for SaaS clients. Core Web Vitals at 95+, structured data, and edge rendering — engineered to win on search and convert on first scroll.',
  //   stack: ['Next.js', 'Sanity', 'Framer Motion', 'Vercel Edge'],
  //   accent: 'linear-gradient(135deg, #1a1a1a 0%, #444 100%)',
  //   glyph: '↗',
  //   size: 'sm',
  //   featured: true,
  //   href: ""
  // },
  {
    slug: 'manvasam',
    index: '03',
    title: 'Manvasam',
    client: 'Singapore',
    year: '2024',
    category: 'Supply Chain',
    impact:
      'Engineered a high-end branding and product showcase platform for a global coconut supplier, focusing on immersive visual storytelling and sustainability.',
    description:
      'A B2B trade portal handling bulk orders, multi-currency pricing, and document workflows across jurisdictions. Built the entire frontend architecture from scratch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'after efffects', 'illustrator', 'claude code'],
    accent: 'linear-gradient(135deg, #E8DDD0 0%, #8B7355 100%)',
    glyph: '⬡',
    size: 'sm',
    featured: true,
    href: "https://manvasam.vercel.app/",
    image: '/man.svg',
    bgc:'white',
  },
  {
    slug: 'modulus',
    index: '04',
    title: 'Modulus Housing',
    client: 'End-to-End SaaS',
    year: '2024',
    category: 'B2B SaaS',
    impact:
      'Delivered an end-to-end B2B branding website resulting in 30-50% growth in user engagement.',
    description:
      'Frontend lead on a multi-tenant property management SaaS. Owned the entire surface from auth to billing dashboard, with a custom design system shared across web and mobile webview.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'after efffects'],
    accent: 'linear-gradient(135deg, #2D3142 0%, #4F5D75 100%)',
    glyph: '▣',
    size: 'lg',
    featured: true,
    href: "https://www.modulushousing.com/",
    image: '/modulus.jpg',
    bgc:'white',
  },
  {
    slug: 'sphere',
    index: '01',
    title: 'Sphere',
    client: 'Voice AI Interface',
    year: '2025',
    category: 'AI / Real-time',
    // AI startup keywords: low-latency, streaming, audio-reactive
    impact:
      'Engineered a low-latency, browser-based voice AI interface with streaming audio I/O and audio-reactive 3D visualizations.',
    description:
      'A real-time conversational AI surface built on streaming WebSockets and the Web Audio API. The 3D visualizer reacts to amplitude and FFT data in real time, absorbing perceived round-trip latency. Sub-300ms voice-to-response on production load.',
    stack: ['Next.js', 'TypeScript', 'WebSockets', 'R3F', 'Web Audio API'],
    accent: 'linear-gradient(135deg, #FF4500 0%, #1a1a1a 100%)',
    glyph: '◉',
    size: 'lg',
    featured: true,
    href: "https://sphere-red.vercel.app/",
    image: '/Sphere.svg',
    bgc:'black',
  },
  // ─── /projects archive only (featured: false) ───
  // {
  //   slug: 'analytics-dash',
  //   index: '05',
  //   title: 'Edge-rendered Analytics Console',
  //   client: 'YC-backed Fintech — US',
  //   year: '2024',
  //   category: 'B2B / Data Viz',
  //   impact: 'TTI reduced from 4.8s to 0.9s. Session length up 64%.',
  //   description:
  //     'Rebuilt a sluggish analytics dashboard on Next.js App Router with RSC streaming, edge-cached aggregations, and a custom virtualized grid handling 50k rows without jank.',
  //   stack: ['Next.js 15', 'tRPC', 'Postgres', 'Edge Functions', 'D3'],
  //   accent: 'linear-gradient(135deg, #1e3a8a 0%, #0c4a6e 100%)',
  //   glyph: '◈',
  //   size: 'sm',
  //   featured: false,
  //   href: "https://sphere-red.vercel.app/"
  // },
  // {
  //   slug: 'editorial-cms',
  //   index: '06',
  //   title: 'Editorial Publishing System',
  //   client: 'Independent Magazine — NYC',
  //   year: '2023',
  //   category: 'Editorial / CMS',
  //   impact: 'Editor velocity up 4×. Scroll-depth from 38% to 71%.',
  //   description:
  //     'A block-based composition layer over Sanity, exposing typographic axes, asymmetric grids, and live previews to non-technical editors.',
  //   stack: ['Next.js', 'Sanity', 'Framer Motion', 'GSAP'],
  //   accent: 'linear-gradient(135deg, #3f0d12 0%, #a71d31 100%)',
  //   glyph: '✦',
  //   size: 'sm',
  //   featured: false,
  //   href: "https://sphere-red.vercel.app/"
  // },
  // {
  //   slug: 'commerce-3d',
  //   index: '07',
  //   title: 'Immersive 3D Commerce Platform',
  //   client: 'DTC Footwear Brand — UK',
  //   year: '2024',
  //   category: 'E-commerce / WebGL',
  //   impact: 'Mobile conversion lifted from 1.1% to 2.7%. Lighthouse mobile: 96.',
  //   description:
  //     'A configurable Three.js product studio with custom GLSL shaders for leather, deferred LOD streaming, and a 60fps mobile target.',
  //   stack: ['Next.js', 'Three.js', 'GLSL', 'Blender', 'Vercel Edge'],
  //   accent: 'linear-gradient(135deg, #5d4037 0%, #d7ccc8 100%)',
  //   glyph: '◐',
  //   size: 'sm',
  //   featured: false,
  //   href: "https://sphere-red.vercel.app/"
  // },
  // {
  //   slug: 'design-system',
  //   index: '08',
  //   title: 'Cross-product Design System',
  //   client: 'Series A Marketplace',
  //   year: '2023',
  //   category: 'Design Systems',
  //   impact: 'Onboarded 12 engineers; ship velocity up 2.3×.',
  //   description:
  //     'A headless component library with design tokens piped from Figma, full a11y coverage, and Storybook-driven docs.',
  //   stack: ['React', 'Radix', 'CSS Vars', 'Storybook', 'Figma Tokens'],
  //   accent: 'linear-gradient(135deg, #2d6a4f 0%, #95d5b2 100%)',
  //   glyph: '⬢',
  //   size: 'sm',
  //   featured: false,
  //   href: "https://sphere-red.vercel.app/"
  // },
];

/* ─────────────────────────────────────────────────────────────────── *
 * 5. STACK — tools grouped by impact (Stack section)
 * Used in: components/stack.tsx
 *
 * To add a tool, add an object. To add a new group, add a key.
 * "Premiere" not "Premier" — fixed.
 * ─────────────────────────────────────────────────────────────────── */
export const stackGroups = {
  Core: [
    { name: 'React', detail: '4 yrs' },
    { name: 'Next.js', detail: 'App Router' },
    { name: 'TypeScript', detail: 'strict' },
    { name: 'Tailwind CSS', detail: 'design systems' },
  ],
  Experience: [
    { name: 'React Three Fiber', detail: 'shipped 6+ projects' },
    { name: 'Three.js', detail: 'GLSL shaders' },
    { name: 'Blender', detail: 'asset pipeline' },
    { name: 'Framer Motion', detail: 'micro-interactions' },
    { name: 'Adobe Premiere Pro', detail: 'motion reference' },
    { name: 'Figma', detail: 'design handoff' },
  ],
  Infrastructure: [
    { name: 'Vercel', detail: 'edge functions' },
    { name: 'Node.js', detail: 'REST + tRPC' },
    { name: 'CI/CD', detail: 'GitHub Actions' },
    { name: 'Performance', detail: 'Lighthouse 95+' },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────── *
 * 6. STATS — impact numbers in the Stack section
 * Used in: components/stack.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const stats = [
  { value: '8+', label: 'Client websites delivered.' },
  { value: '50 - 75%', label: 'Faster data fetch via type-safe REST APIs.' },
  { value: '60%', label: 'Reduction in client JS via SSR & serverless.' },
];

/* ─────────────────────────────────────────────────────────────────── *
 * 7. ABOUT — short note + meta strip
 * Used in: components/about.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const about = {
  // The single big quote
  headline:
    'I bridge the gap between complex engineering and world class design - building the layers and interfaces that everyone likes and respects.',
  // The word(s) inside `headline` to italicize / mute
  italicPhrase: 'complex engineering',

  paragraphs: [
    'Four years, twelve production clients. Most of my work runs in front of paying customers today - at fintechs, marketplaces, and DTC brands across the world.',
    'The pattern is the same: a founder has a product where the interface is the product. They need someone who can hold both the typographic detail and the bundle size, the spring damping and the edge function. I do that.',
  ],

  meta: [
    // { label: 'Availability', value: 'Q3 2026 — limited' },
    // { label: 'Based', value: 'Chennai, India' },
    // { label: 'Open to', value: 'Remote & Relocation — UK & US' },
  ],
};

/* ─────────────────────────────────────────────────────────────────── *
 * 8. MARQUEE — scrolling ticker between sections
 * Used in: components/marquee.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const marqueePhrases = [
  'Performance',
  'Typography',
  'Motion',
  'Accessibility',
  // 'WebGL',
  'Edge rendering',
  'Design systems',
  'TypeScript',
  'Spatial UI',
  'Real-time',
];

/* ─────────────────────────────────────────────────────────────────── *
 * 9. CONTACT — copy + email
 * Used in: components/contact.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const contact = {
  eyebrow: 'Contact',
  headline: `Let's build`,
  headlineItalic: 'something memorable.',
  pitch:
    `Tell me what you're shipping and I'll respond within 24 hours.`,
    // I take on a small number of new engagements each quarter. 
  email: 'vimaloffi1@gmail.com',
  calendarUrl: 'https://cal.com/vimal',
  // Form success message — feels premium when subtle and direct
  successHeadline: 'Message received.',
  successBody:
    'Thanks for reaching out. I\u2019ll be back to you within 24 hours, usually faster.',
};

/* ─────────────────────────────────────────────────────────────────── *
 * 10. FOOTER — socials + meta
 * Used in: components/footer.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vimalrjoffi/' },
  { label: 'GitHub', href: 'https://github.com/vimal-hash' },
  // { label: 'Twitter / X', href: 'https://x.com/vimal' },
  // { label: 'Read.cv', href: 'https://read.cv/vimal' },
];

export const footerCopy = {
  taglineActive: 'Available for new work',
  taglineRelocation: 'Open to Remote & Freelance',
  copyright: '© 2026 Vimal. All rights reserved.',
  // buildTag: 'v1.4 / elite',
};

/* ─────────────────────────────────────────────────────────────────── *
 * 11. SEO / METADATA
 * Used in: app/layout.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const seo = {
  title: 'Vimal - Frontend Engineer',
  titleTemplate: '%s — Vimal',
  description:
    'Frontend Engineer specializing in React, TypeScript, and 3D web environments. Building immersive, high-performance web experiences for founders in the UK and US.',
  keywords: [
    'Frontend Engineer',
    'React Developer',
    'Next.js Developer',
    'TypeScript',
    'Three.js',
    'React Three Fiber',
    'WebGL',
    'Performance Engineer',
    'AI Interface',
    'UK Remote',
    'US Remote',
  ],
};
