module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui', 'jsonresume-theme-papirus'],
  async rewrites() {
    return [
      {
        source: '/:payload',
        destination: '/api/:payload',
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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.hbs$/,
      loader: 'handlebars-loader',
      options: {
        precompileOptions: {
          knownHelpersOnly: false,
        },
      },
    });
    const name = 'next';

    class NextEntryPlugin {
      apply(compiler) {
        compiler.hooks.afterEnvironment.tap('NextEntryPlugin', () => {
          compiler.options.resolve.conditionNames = [
            ...compiler.options.resolve.conditionNames,
            name,
          ];
        });
      }
    }
    config.plugins.push(new NextEntryPlugin());
    return config;
  },
};
