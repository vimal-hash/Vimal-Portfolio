/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Performance: minify with SWC, compress responses, drop poweredBy header.
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Transpile three.js ecosystem so it shares the same compile pass as the app.
  // Avoids ESM/CJS interop issues and ensures a single React instance.
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'postprocessing',
    'three-stdlib',
    'maath',
  ],

  // Tree-shake icon and animation libs more aggressively
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@react-three/drei',
    ],
  },

  // Long-cache static assets and Next's static chunks
  async headers() {
    return [
      {
        source: '/:path*.(glb|webp|jpg|jpeg|png|svg|woff2|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
