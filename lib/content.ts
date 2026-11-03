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
  availability: 'Available',
  remoteRelocation: 'Open to Remote',
  workingWith: 'UK & US founders',
  specialty: 'React · R3F · Performance',
  email: 'vimaloffi1@gmail.com',
  resumePath: '/resume/Vimal_resume_design_engineer.pdf',
  calendarUrl: 'https://cal.com/vimal',
  websiteUrl: 'https://vimal.dev',
} as const;

/* ─────────────────────────────────────────────────────────────────── *
 * 2. HERO — the first thing they see
 * Used in: components/showcase.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const hero = {
  // Split into 3 parts for italic styling
  headline: {
    line1: 'Hi!',
    line1Italic: `I'm`, // rendered muted
    line2: 'Vimal',
  },
  subhead:
    "Design engineer / Full stack dev. I build fast websites, often with 3D in them, using React, TypeScript and Three.js.",
  primaryCta: { label: 'Get in touch', href: 'mailto:vimaloffi1@gmail.com' },
  secondaryCta: { label: 'Resume', href: identity.resumePath },
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
 * 4. PROJECTS — 3D gallery + /projects archive
 * Used in: components/work-gallery, components/work.tsx, components/projects-catalogue.tsx
 *
 * The order here is the order on the site.
 * ─────────────────────────────────────────────────────────────────── */
export type Project = {
  slug: string;
  index: string;
  title: string;
  client: string;
  location: string;
  year?: string;
  category: string;
  /** One short result, shown as a pill on the gallery card. */
  highlight?: string;
  impact: string;
  description: string;
  stack: string[];
  href?: string;
  accent: string;
  glyph?: string;
  size: 'sm' | 'lg';
  featured: boolean;
  image: string;
  bgc: string;
};

export const projects: Project[] = [
  {
    slug: 'modulus',
    index: '01',
    title: 'Modulus Housing',
    client: 'Prefab construction company',
    location: 'Chennai, India',
    year: '2024',
    category: 'Branding site',
    highlight: 'Raised $7M with this site',
    impact:
      'A branding site built to win over investors. Modulus raised $7M using it.',
    description:
      'The brand website for a prefab construction company in Chennai, made for their fundraise and built from start to launch. They raised $7M with it.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'After Effects'],
    accent: 'linear-gradient(135deg, #2D3142 0%, #4F5D75 100%)',
    glyph: '▣',
    size: 'lg',
    featured: true,
    href: 'https://www.modulushousing.com/',
    image: '/modulus.jpg',
    bgc: 'white',
  },
  {
    slug: 'sphere',
    index: '02',
    title: 'Sphere',
    client: 'Voice AI interface',
    location: 'Chennai, India',
    year: '2025',
    category: 'R3F + AI integration',
    impact:
      'A voice AI you talk to in the browser. Audio streams both ways with low latency, and the 3D visual moves with the sound.',
    description:
      'It talks to the model over WebSockets and handles sound with the Web Audio API. The 3D visual runs off live amplitude and FFT data, which also makes the wait for a reply feel shorter. Voice to response takes under 300ms in production.',
    stack: ['Next.js', 'TypeScript', 'WebSockets', 'R3F', 'Web Audio API'],
    accent: 'linear-gradient(135deg, #FF4500 0%, #1a1a1a 100%)',
    glyph: '◉',
    size: 'lg',
    featured: true,
    href: 'https://sphere-red.vercel.app/',
    image: '/Sphere.webp',
    bgc: 'black',
  },
  {
    slug: 'manvasam',
    index: '03',
    title: 'Manvasam',
    client: 'Coconut supplier',
    location: 'Singapore',
    year: '2024',
    category: 'Branding site',
    impact:
      'A brand and product site for a coconut supplier that sells worldwide, built around strong visuals and their sustainability story.',
    description:
      'A site for a coconut processor that exports worldwide, covering its supply chain, certifications and product range. I built the whole frontend from scratch.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'After Effects', 'Illustrator', 'Claude Code'],
    accent: 'linear-gradient(135deg, #E8DDD0 0%, #8B7355 100%)',
    glyph: '⬡',
    size: 'sm',
    featured: true,
    href: 'https://manvasam.vercel.app/',
    image: '/man.svg',
    bgc: 'white',
  },
  // Under NDA: the client name, logo, link and project details stay out of this file.
  {
    slug: 'confidential',
    index: '04',
    title: 'Confidential Project',
    client: 'Client withheld',
    location: 'Singapore',
    category: 'Full-stack grocery e-commerce',
    impact:
      "A full-stack grocery store. It's under NDA, so I can't share the name, logo, link or details.",
    description:
      "A full-stack grocery store. It's under NDA, so I can't share the name, logo, link or details.",
    stack: [],
    accent: 'linear-gradient(135deg, #2D3142 0%, #4F5D75 100%)',
    glyph: '▣',
    size: 'lg',
    featured: true,
    image: '',
    bgc: '#1a1c20',
  },
];

/* ─────────────────────────────────────────────────────────────────── *
 * 5. STACK — tools grouped by impact (Stack section)
 * Used in: components/stack.tsx
 *
 * To add a tool, add an object. To add a new group, add a key.
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
  { value: '8+', label: 'Client websites shipped.' },
  { value: '50–75%', label: 'Faster data fetching with type-safe REST APIs.' },
  { value: '60%', label: 'Less JavaScript sent to the browser, using SSR and serverless.' },
];

/* ─────────────────────────────────────────────────────────────────── *
 * 7. ABOUT — short note + meta strip
 * Used in: components/about.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const about = {
  // The single big quote
  headline:
    'I care about how a website is built as much as how it looks.',
  // The word(s) inside `headline` to mute
  italicPhrase: 'how it looks',

  paragraphs: [
    "I've spent four years building websites for clients. Most of that work is still live, used by real customers at fintechs, marketplaces and DTC brands.",
    "Most of the people I work with have a product where the interface really matters. So I look after both sides of it: the type and the bundle size, how something moves and how fast it loads.",
  ],
};

/* ─────────────────────────────────────────────────────────────────── *
 * 8. CONTACT — copy + email
 * Used in: components/contact.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const contact = {
  eyebrow: 'Contact',
  headline: 'Got a project?',
  headlineItalic: "Let's talk.",
  pitch:
    `Tell me what you're working on and I'll reply within 24 hours.`,
  email: 'vimaloffi1@gmail.com',
  calendarUrl: 'https://cal.com/vimal',
  successHeadline: 'Thanks, got it.',
  successBody:
    'I\u2019ll get back to you within 24 hours, usually sooner.',
};

/* ─────────────────────────────────────────────────────────────────── *
 * 9. FOOTER — socials + meta
 * Used in: components/footer.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vimalrjoffi/' },
  { label: 'GitHub', href: 'https://github.com/vimal-hash' },
  { label: 'Twitter', href: 'https://x.com/Vimal_dev_' },
];

export const footerCopy = {
  taglineActive: 'Available for new work',
  taglineRelocation: 'Open to remote and freelance work',
  copyright: '© 2026 Vimal. All rights reserved.',
};

/* ─────────────────────────────────────────────────────────────────── *
 * 10. SEO / METADATA
 * Used in: app/layout.tsx
 * ─────────────────────────────────────────────────────────────────── */
export const seo = {
  title: 'Vimal - Frontend Engineer',
  titleTemplate: '%s — Vimal',
  description:
    'Frontend engineer in Chennai. I build fast websites and 3D web experiences with React, TypeScript and Three.js, for clients in the UK and US.',
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
