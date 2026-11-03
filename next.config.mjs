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

  // Long-cache static assets. Next sets this itself for its hashed production chunks;
  // dev chunks have stable names, so caching them here would pin browsers to old code.
  async headers() {
    return [
      {
        source: '/:path*.(glb|ktx2|webp|jpg|jpeg|png|svg|woff2|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Dev only, once per browser: clears the old dev bundles an earlier header
      // pinned for a year. Safe to delete once every dev browser has loaded the site.
      ...(process.env.NODE_ENV === 'development'
        ? [
            {
              source: '/',
              missing: [{ type: 'cookie', key: 'dev-cache-reset' }],
              headers: [
                { key: 'Clear-Site-Data', value: '"cache"' },
                { key: 'Set-Cookie', value: 'dev-cache-reset=1; Path=/; Max-Age=31536000' },
              ],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
