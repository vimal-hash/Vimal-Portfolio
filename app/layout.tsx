import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { ThemeProvider, ThemeScript } from '@/components/theme-provider';
import { SmoothScroll } from '@/components/smooth-scroll';
import { seo, identity } from '@/lib/content';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
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
      className={spaceGrotesk.variable}
    >
      <head>
        <ThemeScript defaultTheme="light" />
        <link
          rel="preload"
          as="fetch"
          href="/Portfolio3-draco.glb"
          type="model/gltf-binary"
          crossOrigin="anonymous"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="fetch"
          href="/Portfolio3-mobile.glb"
          type="model/gltf-binary"
          crossOrigin="anonymous"
          media="(max-width: 767px)"
        />
        <link rel="preload" as="fetch" href="/Wood/diff.ktx2" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/Wood/arm.ktx2" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/Cw/diffuse.ktx2" crossOrigin="anonymous" />
        <link rel="preload" as="script" href="/decoders/draco/draco_wasm_wrapper.js" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/decoders/draco/draco_decoder.wasm" crossOrigin="anonymous" />
        <link rel="preload" as="script" href="/decoders/basis/basis_transcoder.js" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/decoders/basis/basis_transcoder.wasm" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="/hero-poster-phone.jpg"
          type="image/jpeg"
          media="(max-width: 767px)"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="light" enableSystem>
          <SmoothScroll />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
