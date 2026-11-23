import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Every page is static (example sources are read from disk at build
  // time), so the build is plain files in out/, served by the box's Caddy
  // at styleguide.jsonresume.org.
  output: 'export',
};

// vanilla-extract compiles .css.ts files through webpack, so dev and build
// run with --webpack.
export default withVanillaExtract(nextConfig);
