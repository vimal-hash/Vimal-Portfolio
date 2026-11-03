// Bump when assets in public/work-gallery are rebuilt: next.config.mjs serves
// them with a one-year immutable cache, so the URL has to change.
const ASSET_VERSION = '4';

export const asset = (file: string) => `/work-gallery/${file}?v=${ASSET_VERSION}`;

export const KTX2_PATH = '/decoders/basis/';
export const DRACO_PATH = '/decoders/draco/';

export type CardTheme = {
  /** Deep gradient behind the artwork, dark so the card holds against a white room. */
  bg: [string, string];
  glow: string;
  /** Colour of the title and the single-colour logo. */
  ink: string;
  /** Tint of the glass and of the light the card throws onto the wall. */
  tint: string;
  /** Dark, mid and light shades for the particles. */
  pigment: [string, string, string];
  /** cover: full-bleed image. logo: keyed to a single colour and fitted beside the title. */
  art: 'cover' | 'logo';
  /** SVGs without width/height report no natural size, so the aspect is stated here. */
  aspect?: number;
};

const FALLBACK_THEME: CardTheme = {
  bg: ['#0c0d10', '#23262e'],
  glow: 'rgba(150,220,255,.28)',
  ink: '#f4f1ea',
  tint: '#a9c4d8',
  pigment: ['#1a2a3a', '#4f7fa0', '#96dcff'],
  art: 'logo',
};

const THEMES: Record<string, CardTheme> = {
  sphere: {
    bg: ['#040507', '#12141a'],
    glow: 'rgba(150,190,255,.24)',
    ink: '#f6f3ec',
    tint: '#aebfe0',
    pigment: ['#14203a', '#5f81c0', '#a9c3ee'],
    art: 'cover',
  },
  manvasam: {
    bg: ['#05241a', '#0f5a3d'],
    glow: 'rgba(90,220,150,.32)',
    ink: '#eaf6e6',
    tint: '#4fb27e',
    pigment: ['#0e4a32', '#2f9e6a', '#7ed6a1'],
    art: 'logo',
    aspect: 1407.63 / 1065.23,
  },
  modulus: {
    bg: ['#04232a', '#0b6570'],
    glow: 'rgba(80,210,220,.32)',
    ink: '#e6f7f7',
    tint: '#36aab3',
    pigment: ['#0a4f59', '#1f95a0', '#7fd9dd'],
    art: 'logo',
  },
  confidential: {
    bg: ['#0b0c0e', '#2a2d33'],
    glow: 'rgba(190,205,225,.2)',
    ink: '#f2f1ec',
    tint: '#9aa3ad',
    pigment: ['#23262b', '#5d646d', '#a4acb6'],
    art: 'logo',
  },
};

export const themeFor = (slug: string): CardTheme => THEMES[slug] ?? FALLBACK_THEME;

/** Scroll, pointer and theme state, written by the DOM section and read each frame by the scene. */
export type GalleryMotion = {
  /** 0..n-1, with a dwell on each whole number. */
  target: number;
  /** 0 when the section is just below the fold, 1 once it docks. */
  enter: number;
  pointerX: number;
  pointerY: number;
  dark: boolean;
};
