module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  async rewrites() {
    return [
      {
        source: '/:payload',
        destination: '/:payload',
      },
      {
        source: '/:payload/interview',
        destination: '/interview',
      },
      {
        source: '/:payload/jobs',
        destination: '/jobs',
      },
      {
        source: '/:payload/letter',
        destination: '/letter',
      },
      {
        source: '/:payload/suggestions',
        destination: '/suggestions',
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
        pathname: '/*',
      },
    ],
  },

  // Can be safely removed in newer versions of Next.js
  future: {
    // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
    webpack5: true,
  },

  webpack(config) {
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,

      fs: false, // the solution
    };

    return config;
  },
};
