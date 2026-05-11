# Vimal — Portfolio (v1.4)

Editorial portfolio with a black 3D-scene hero, bento work grid, and `/projects` archive. Engineered for UK/US startup hiring managers.

## Quick start (pnpm)

```bash
# Clean slate
rm -rf node_modules .next pnpm-lock.yaml package-lock.json

# Install — pnpm is the project manager
pnpm install

# Dev
pnpm dev          # → http://localhost:3000

# Production
pnpm build && pnpm start
```

**Use pnpm, not npm.** `packageManager: pnpm@9.12.3` is declared in `package.json`. The `.npmrc` uses `shamefully-hoist=true` which produces a flat `node_modules` layout (like npm). This is required because `@react-three/drei` has deeply-nested dependencies (`three-stdlib`, internal helpers) that need flat resolution.

## ✏️ Editing content — everything lives in ONE file

**All editable copy, projects, stats, social links, and SEO data live in `lib/content.ts`.** No need to dig through components.

| What you want to change | Open `lib/content.ts` and edit |
|---|---|
| Your name, role, email, resume path | `identity` |
| Hero headline / subhead / CTA buttons | `hero` |
| Top-nav links | `navLinks` |
| **Add/edit/reorder projects** | `projects` array |
| Tools list (Stack section) | `stackGroups` |
| Big stats (8+, 50-75%, 60%) | `stats` |
| About section copy | `about` |
| Marquee phrases | `marqueePhrases` |
| Contact form copy + success message | `contact` |
| Social links (LinkedIn, GitHub, etc) | `socials` |
| Footer taglines / build version | `footerCopy` |
| SEO title / description / keywords | `seo` |

### Adding a new project

Open `lib/content.ts`, scroll to `projects`, copy any existing project, paste, change values. Set `featured: true` to show in the bento grid, or `false` to put it only in `/projects`.

To change bento grid order: rearrange items in the array. The first 4 with `featured: true` show in this order:
- Position 1 (`size: 'lg'`) → large card top
- Position 2 (`size: 'sm'`) → small mid-left
- Position 3 (`size: 'sm'`) → small mid-right
- Position 4 (`size: 'lg'`) → large bottom

That's it. No code changes needed.

## Required public assets

```
public/
├── Portfolio3.glb
├── Rw/Rough-wall.webp, Normal-wall.webp
├── Cw/diffuse.webp
├── Wood/diff.webp, arm.webp
├── textures/floor/floor_diffuse.jpg, floor_Normal.jpg, floor_Roughness.jpg, floor_ao.jpg
└── resume/Vimal_sphere_resume.pdf
```

## What's new in v1.4

1. **Hero is black, always.** No more theme-conditional cream background — the room scene reads "elite tech startup" (Stripe/Vercel/OpenAI) on black. Theme toggle still works for the rest of the page.
2. **Nav stays readable over the dark hero.** Auto-switches between white-text (over hero) and theme-aware (after scroll past hero).
3. **Bento grid reordered:** Sphere (lg) → SaaS Landing (sm) → Manvasam (sm) → Modulus (lg).
4. **Sphere is the lead** with AI-startup keywords baked in: *low-latency, streaming, audio-reactive*.
5. **Premium contact success state**: form fades out, checkmark + message fade in with stagger. No abrupt swap.
6. **Mobile-tuned 3D scene**: DPR capped at 1.5 on phones, lower shadow map, no post-processing, 60° FOV. Targets 60fps on mid-range Android.
7. **Open to Remote & Relocation**: shown in footer (own band) and about meta — vital signal for UK/US recruiters.
8. **"Premiere"** correctly spelled in `stackGroups.Experience`.
9. **Marquee** infinite-loops smoothly (40s/cycle, no stutter).
10. **pnpm** is the package manager. `.npmrc` hoists React correctly.
11. **All content in `lib/content.ts`** — single source of truth.

## Stack

- Next.js 14.2.18 (App Router)
- React 18.3.1
- React Three Fiber 8.17.10 + drei 9.117
- three 0.169 + three-stdlib + maath
- gsap 3.12 + @gsap/react 2.1
- Tailwind CSS 3.4 + Framer Motion 11
- Custom theme provider (zero deps, no next-themes)
- Inter + JetBrains Mono + Instrument Serif

> **Note**: `@react-three/postprocessing` was removed. Tonemapping is handled
> at the renderer level (`THREE.ACESFilmicToneMapping`) — same visual result
> on a dark scene, no extra dependency, no pnpm hoisting conflicts.

## Performance budget (verified)

- `/` route: 156 KB First Load JS, 122ms server response (cold prod)
- `/projects` route: 152 KB First Load JS, 14ms server response
- Shared chunks: 87 KB
- Mobile: scene runs at 60fps on iPhone 12 / Pixel 6 (post-processing off)
- 1-year `Cache-Control: immutable` on all static assets

## Architecture

```
app/
├── layout.tsx                Root layout + fonts + metadata
├── page.tsx                  Home composition
├── globals.css               Theme tokens + utilities
├── not-found.tsx             404
└── projects/page.tsx         /projects route

components/
├── Portfolio3.tsx            Your GLTFJSX scene (drop-in)
├── CameraRig.tsx             Your camera rig (drop-in)
├── showcase.tsx              Canvas + editorial overlay (black bg)
├── hero.tsx                  Dynamic-imports Showcase (ssr: false)
├── nav.tsx                   Theme-aware + over-hero modes
├── work.tsx                  2×2 bento grid
├── projects-catalogue.tsx    /projects archive
├── stack.tsx                 Big stats + tool groups
├── about.tsx                 Short note + meta strip
├── contact.tsx               Form + premium success state
├── marquee.tsx               Infinite ticker
├── footer.tsx                Socials + signature + relocation
├── cursor.tsx                Desktop-only dot cursor
├── theme-toggle.tsx          Sun/moon with invert mode
└── theme-provider.tsx        Custom theme provider (zero deps)

lib/
├── content.ts                ⭐ ALL EDITABLE CONTENT HERE
└── utils.ts                  cn() helper
```

## Pre-launch checklist

- [ ] Verify all assets in `public/` (see tree above)
- [ ] Wire `components/contact.tsx` to a real email API (Resend/Postmark) — replace the `setTimeout` stub
- [ ] Update social URLs in `lib/content.ts` → `socials`
- [ ] Add `public/og-image.png` (1200×630)
- [ ] Set the real domain in `lib/content.ts` → `identity.websiteUrl`
- [ ] Test on real iPhone + Android device
- [ ] Run Lighthouse — should score 95+ across all categories
