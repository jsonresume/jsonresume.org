module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  async rewrites() {
    return [
      // Docs are built from apps/docs (basePath /docs) and deployed as a
      // static export to GitHub Pages; serve them under jsonresume.org/docs.
      {
        source: '/docs',
        destination: 'https://jsonresume.github.io/jsonresume.org/',
      },
      {
        source: '/docs/:path*',
        destination: 'https://jsonresume.github.io/jsonresume.org/:path*',
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'in.getclicky.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'registry.jsonresume.org',
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
        hostname: 'screenshot-peach-beta.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
