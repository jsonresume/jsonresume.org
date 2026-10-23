import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Example sources (and their .css.ts files) are read from disk at build
  // time and shown next to the live example.
  outputFileTracingIncludes: { '/components/[slug]': ['./examples/**/*'] },
};

// vanilla-extract compiles .css.ts files through webpack, so dev and build
// run with --webpack.
export default withVanillaExtract(nextConfig);
