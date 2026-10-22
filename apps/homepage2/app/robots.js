// Cloudflare prepends its managed content-signal comments to this file.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://jsonresume.org/sitemap.xml',
  };
}
