import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  // Served at jsonresume.org/docs via a homepage2 rewrite to GitHub Pages.
  // basePath prefixes all URLs (pages + assets) with /docs; the static
  // export in out/ keeps files at the root, so the GitHub Pages project
  // path (jsonresume.github.io/jsonresume.org/) maps 1:1.
  basePath: '/docs',
};

export default withMDX(config);
