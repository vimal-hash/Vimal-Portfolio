import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import { ThemeProvider, ThemeScript } from '@/components/theme-provider';
import { seo, identity } from '@/lib/content';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(identity.websiteUrl),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: identity.name }],
  creator: identity.name,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: identity.websiteUrl,
    siteName: seo.title,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} ${instrument.variable}`}
    >
      <head>
        <ThemeScript defaultTheme="light" />
        <link
          rel="preload"
          as="fetch"
          href="/Portfolio3-draco.glb"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
        <link rel="preload" as="fetch" href="/Wood/diff.ktx2" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/Wood/arm.ktx2" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/Cw/diffuse.ktx2" crossOrigin="anonymous" />
        {/* Self-hosted Draco/Basis decoder+transcoder (see components/Portfolio3.tsx).
            Preloading lets the browser fetch these in parallel with the JS bundle
            instead of discovering them only after the loader code runs. */}
        <link rel="preload" as="script" href="/decoders/draco/draco_wasm_wrapper.js" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/decoders/draco/draco_decoder.wasm" crossOrigin="anonymous" />
        <link rel="preload" as="script" href="/decoders/basis/basis_transcoder.js" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/decoders/basis/basis_transcoder.wasm" crossOrigin="anonymous" />
        {/* Mobile-only poster preload — browser only fetches if media matches,
            so desktop doesn't waste bandwidth on an image it won't render. */}
        <link
          rel="preload"
          as="image"
          href="/hero-poster.jpg"
          type="image/jpeg"
          media="(max-width: 767px)"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
