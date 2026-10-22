const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
  // PDF export (lib/formatters/pdf.js) launches serverless Chromium on
  // Vercel. Keep it out of the bundle and ship its binary pack with the
  // resume route, which file tracing can't detect on its own.
  serverExternalPackages: ['@sparticuz/chromium', 'playwright-core'],
  outputFileTracingIncludes: {
    // The real path, not pnpm's node_modules/@sparticuz/chromium symlink:
    // Vercel rejects functions that contain files under symlinked dirs.
    '/api/[username]': [
      '../../node_modules/.pnpm/@sparticuz+chromium@*/node_modules/@sparticuz/chromium/bin/**',
    ],
  },
  // Skip TypeScript type checking during build to avoid memory issues with 60+ theme imports
  // Type checking still happens in dev (tsc --watch) and CI (separate step)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable styled-components SSR support
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize pdf-parse and its dependencies for server-side only
      config.externals = config.externals || [];
      config.externals.push('pdf-parse', 'canvas');
    }
    return config;
  },
  // API responses are live or per-user data. Cloudflare's 4h Browser Cache
  // TTL rewrites the default max-age=0 (and no-cache) to max-age=14400, so
  // browsers reused stale API responses; only no-store passes through (#552).
  async headers() {
    return [
      {
        // A next.config header overrides the route's own, so skip routes that
        // set deliberate caching (keep this list in sync with them)
        source:
          '/api/:path((?!similarity|job-similarity|ats|favicon|speech|relevant-jobs|[^/]+/jobs$).*)',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
  async redirects() {
    return [
      // The registry's own gallery depended on a paused screenshot service;
      // jsonresume.org/themes has maintained static screenshots.
      {
        source: '/themes',
        destination: 'https://jsonresume.org/themes',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:payload',
        destination: '/api/:payload',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'in.getclicky.com',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
        port: '',
        pathname: '/avatar/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars0.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.registry.jsonresume.org',
        'registry.jsonresume.org',
      ],
    },
  },
};

export default nextConfig;
