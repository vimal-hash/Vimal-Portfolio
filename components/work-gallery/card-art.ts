import * as THREE from 'three';
import type { Project } from '@/lib/content';
import type { CardTheme } from './config';

// Each card has two layers: artwork (refracted inside the glass) and a transparent
// title layer floating above it, so the two can move apart with parallax.

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });

function cssFont(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

/** Turns any logo into a single-colour silhouette cropped to its bounds. */
function keyLogo(img: HTMLImageElement, ink: string, aspect?: number) {
  const natural = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
  const ratio = aspect ?? natural;
  const w = ratio >= 1 ? 1024 : Math.round(1024 * ratio);
  const h = ratio >= 1 ? Math.round(1024 / ratio) : 1024;

  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);

  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

  let x0 = w;
  let y0 = h;
  let x1 = 0;
  let y1 = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      // Distance from white, so a logo on a white plate and a transparent one both key cleanly.
      const dark = 1 - Math.min(px[i], px[i + 1], px[i + 2]) / 255;
      const key = Math.min(1, Math.max(0, (dark - 0.04) / 0.26));
      const a = (px[i + 3] / 255) * key;
      px[i] = r;
      px[i + 1] = g;
      px[i + 2] = b;
      px[i + 3] = a * 255;
      if (a > 0.05) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  ctx.putImageData(data, 0, 0);
  return { canvas: c, x: x0, y: y0, w: Math.max(1, x1 - x0 + 1), h: Math.max(1, y1 - y0 + 1) };
}

function grain(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const n = document.createElement('canvas');
  n.width = n.height = 256;
  const nctx = n.getContext('2d')!;
  const id = nctx.createImageData(256, 256);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = Math.random() * 255;
    id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
    id.data[i + 3] = 255;
  }
  nctx.putImageData(id, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.035;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(n, 'repeat')!;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function paintBase(ctx: CanvasRenderingContext2D, W: number, H: number, theme: CardTheme) {
  const base = ctx.createLinearGradient(0, H, W, 0);
  base.addColorStop(0, theme.bg[0]);
  base.addColorStop(1, theme.bg[1]);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.74, H * 0.3, 0, W * 0.74, H * 0.3, W * 0.56);
  glow.addColorStop(0, theme.glow);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}

async function paintArt(ctx: CanvasRenderingContext2D, W: number, H: number, project: Project, theme: CardTheme) {
  paintBase(ctx, W, H, theme);
  if (!project.image) return;
  const img = await loadImage(project.image);

  if (theme.art === 'cover') {
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    const shade = ctx.createLinearGradient(0, H, W * 0.6, 0);
    shade.addColorStop(0, 'rgba(0,0,0,.72)');
    shade.addColorStop(0.55, 'rgba(0,0,0,.08)');
    shade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, W, H);
  } else {
    const logo = keyLogo(img, theme.ink, theme.aspect);
    const boxW = W * 0.34;
    const boxH = H * 0.6;
    const s = Math.min(boxW / logo.w, boxH / logo.h);
    const dw = logo.w * s;
    const dh = logo.h * s;
    const x = W * 0.94 - dw;
    const y = H * 0.1;
    ctx.save();
    ctx.globalAlpha = 0.94;
    ctx.drawImage(logo.canvas, logo.x, logo.y, logo.w, logo.h, x, y, dw, dh);
    ctx.restore();
  }
  grain(ctx, W, H);
}

async function paintFront(ctx: CanvasRenderingContext2D, W: number, H: number, project: Project, theme: CardTheme, lite: boolean) {
  const sans = cssFont('--font-sans', 'system-ui, sans-serif');
  const px = (n: number) => Math.round((n / 1536) * W);
  await Promise.all([document.fonts.load(`500 ${px(170)}px ${sans}`, project.title), document.fonts.load(`400 ${px(22)}px ${sans}`, 'A0')]).catch(() => null);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = theme.ink;
  ctx.textBaseline = 'alphabetic';

  let size = px(176);
  ctx.font = `500 ${size}px ${sans}`;
  ctx.letterSpacing = `${size * -0.03}px`;
  const maxWidth = W * 0.68;
  const measured = ctx.measureText(project.title).width;
  if (measured > maxWidth) {
    size = Math.floor((size * maxWidth) / measured);
    ctx.font = `500 ${size}px ${sans}`;
    ctx.letterSpacing = `${size * -0.03}px`;
  }
  ctx.fillText(project.title, W * 0.06, H * 0.87);

  // Phones show the card much smaller, so the small type has to be drawn larger.
  ctx.font = `400 ${px(lite ? 32 : 21)}px ${sans}`;
  ctx.letterSpacing = `${px(1.5)}px`;
  ctx.globalAlpha = 0.74;
  const label = [project.category, project.location, project.year].filter(Boolean).join('  /  ').toUpperCase();
  ctx.fillText(label, W * 0.06, H * 0.87 - size * 0.86);
  ctx.globalAlpha = 1;

  if (project.highlight) paintHighlight(ctx, W, H, project.highlight, theme.ink, sans, (n) => px(lite ? n * 1.45 : n));
}

function paintHighlight(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  text: string,
  ink: string,
  sans: string,
  px: (n: number) => number,
) {
  ctx.font = `500 ${px(30)}px ${sans}`;
  ctx.letterSpacing = `${px(-0.2)}px`;
  const padX = px(30);
  const h = px(66);
  const w = ctx.measureText(text).width + padX * 2;
  const x = W * 0.06;
  const y = H * 0.1;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fillStyle = ink;
  ctx.fill();

  // Punched out of the pill, so the text shows the card behind it.
  ctx.globalCompositeOperation = 'destination-out';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + padX, y + h / 2 + px(1));
  ctx.textBaseline = 'alphabetic';
  ctx.globalCompositeOperation = 'source-over';
}

export type CardTextures = {
  art: THREE.CanvasTexture;
  front: THREE.CanvasTexture;
  /** Resolves once images and fonts are painted. */
  ready: Promise<void>;
};

export function createCardTextures(project: Project, theme: CardTheme, maxAniso: number, width: number, lite: boolean): CardTextures {
  const W = width;
  const H = Math.round(width / 2);
  const make = () => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    return canvas;
  };
  const artCanvas = make();
  const frontCanvas = make();
  const artCtx = artCanvas.getContext('2d')!;
  const frontCtx = frontCanvas.getContext('2d')!;

  // The gradient is drawn straight away, so a slow image never leaves an empty card.
  paintBase(artCtx, W, H, theme);

  const setup = (t: THREE.CanvasTexture) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, maxAniso);
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    return t;
  };
  const art = setup(new THREE.CanvasTexture(artCanvas));
  const front = setup(new THREE.CanvasTexture(frontCanvas));
  front.premultiplyAlpha = true;

  const ready = Promise.allSettled([paintArt(artCtx, W, H, project, theme), paintFront(frontCtx, W, H, project, theme, lite)]).then(() => {
    art.needsUpdate = true;
    front.needsUpdate = true;
  });

  return { art, front, ready };
}
