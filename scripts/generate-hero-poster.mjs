// Generates a poster JPEG of the hero 3D scene by loading the dev server in
// headless Chrome, waiting for the scene to settle, and screenshotting at
// 1280×800. Output: public/hero-poster.jpg
//
// Re-run any time the hero scene changes:
//   1. pnpm dev   (must be running)
//   2. node scripts/generate-hero-poster.mjs

import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const executablePath = CHROME_PATHS.find((p) => existsSync(p));
if (!executablePath) {
  console.error('No Chrome/Edge found at standard paths.');
  process.exit(1);
}
console.log('Using browser:', executablePath);

const URL = process.env.POSTER_URL || 'http://localhost:3001';
const VIEWPORT = { width: 1280, height: 800, deviceScaleFactor: 1.5 };
// Time to wait for: HTML parse + JS bundle + GLB/KTX2 load + shader compile +
// GSAP timeline (3s delay + 2.5s animation + light fades). 12s is safely past
// the camera-sway start at t=8s on desktop.
const SETTLE_MS = 12000;

const browser = await puppeteer.launch({
  executablePath,
  // headless:'new' uses Chromium's new headless mode with full GPU support
  // (the old --headless flag disabled GPU which breaks WebGL).
  headless: 'new',
  args: [
    '--no-sandbox',
    '--use-gl=angle',
    '--use-angle=default',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
  ],
  defaultViewport: VIEWPORT,
});

const page = await browser.newPage();
console.log(`Loading ${URL} ...`);
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
console.log(`Waiting ${SETTLE_MS}ms for scene to settle ...`);
await new Promise((r) => setTimeout(r, SETTLE_MS));

// Hide all HTML overlays so the poster captures ONLY the 3D scene. The live
// page will re-render the nav + hero text + CTAs on top of the poster, so we
// don't want them baked in (would double-render).
await page.evaluate(() => {
  const hide = (sel) =>
    document.querySelectorAll(sel).forEach((el) => {
      el.style.visibility = 'hidden';
    });
  hide('nav');
  hide('#hero .z-20');
  hide('#hero .z-10'); // gradient scrims — we want the raw scene
});
// Brief pause to let any rAF-driven re-render flush
await new Promise((r) => setTimeout(r, 200));

const buf = await page.screenshot({ type: 'png', fullPage: false });
await browser.close();

// Convert PNG → optimized JPEG. Poster doesn't need transparency and JPEG is
// 5-10× smaller for photographic content like a rendered 3D scene.
const outPath = join(root, 'public', 'hero-poster.jpg');
mkdirSync(dirname(outPath), { recursive: true });
const jpg = await sharp(buf)
  .resize(1280, 800, { fit: 'cover' })
  .jpeg({ quality: 78, mozjpeg: true })
  .toBuffer();
writeFileSync(outPath, jpg);
console.log(`✓ ${outPath} (${(jpg.byteLength / 1024).toFixed(0)} KB)`);
