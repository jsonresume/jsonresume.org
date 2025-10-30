const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
  // Skip TypeScript type checking during build to avoid memory issues with 60+ theme imports
  // Type checking still happens in dev (tsc --watch) and CI (separate step)
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize pdf-parse and its dependencies for server-side only
      config.externals = config.externals || [];
      config.externals.push('pdf-parse', 'canvas');
    }
    return config;
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
