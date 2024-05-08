module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  async rewrites() {
    return [];
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
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'registry.jsonresume.org',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'screenshot-peach-beta.vercel.app',
        port: '',
        pathname: '/*',
      },
    ],
  },
};
