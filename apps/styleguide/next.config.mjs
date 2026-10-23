/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Example sources are read from disk at build time and shown next to the
  // live example; make sure they ship with the server output.
  outputFileTracingIncludes: { '/components/[slug]': ['./examples/**/*'] },
};

export default nextConfig;
