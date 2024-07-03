module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  async rewrites() {
    return [
      {
        source: '/:payload',
        destination: '/api/:payload',
      },
    ];
  },
  //     {
  //       source: '/:payload/interview',
  //       destination: '/interview',
  //     },
  //     {
  //       source: '/:payload/jobs',
  //       destination: '/jobs',
  //     },
  //     {
  //       source: '/:payload/letter',
  //       destination: '/letter',
  //     },
  //     {
  //       source: '/:payload/suggestions',
  //       destination: '/suggestions',
  //     },
  //   ];
  // },
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
