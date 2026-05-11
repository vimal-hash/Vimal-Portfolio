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
        <ThemeScript defaultTheme="dark" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
