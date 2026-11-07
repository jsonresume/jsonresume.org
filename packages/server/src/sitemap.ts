/**
 * Sitemaps (sitemaps.org protocol) and robots.txt. Plain functions with no
 * dependencies, so the prerender script and the live server share them.
 */

/** A page for a sitemap: its path on the site, and when it last changed. */
export interface SitemapEntry {
  path: string;
  /** ISO date or date-time. */
  lastmod?: string | null;
}

/** The protocol's limit per file is 50,000 URLs; stay well under it. */
export const SITEMAP_LIMIT = 40_000;

const xmlText = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/** origin + path, with '/' as the bare origin's own URL. */
export const absoluteUrl = (origin: string, path: string) =>
  `${origin.replace(/\/$/, '')}${path === '/' ? '/' : path}`;

const lastmod = (value: string | null | undefined) =>
  value ? `<lastmod>${xmlText(value.slice(0, 10))}</lastmod>` : '';

/** A <urlset>: one <url> per page. */
export const urlSet = (origin: string, entries: ReadonlyArray<SitemapEntry>) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(
      (e) =>
        `  <url><loc>${xmlText(absoluteUrl(origin, e.path))}</loc>${lastmod(
          e.lastmod
        )}</url>`
    )
    .join('\n')}\n</urlset>\n`;

/** A <sitemapindex>: the sitemaps that list the site between them. */
export const sitemapIndex = (
  origin: string,
  sitemaps: ReadonlyArray<SitemapEntry>
) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps
    .map(
      (s) =>
        `  <sitemap><loc>${xmlText(absoluteUrl(origin, s.path))}</loc>${lastmod(
          s.lastmod
        )}</sitemap>`
    )
    .join('\n')}\n</sitemapindex>\n`;

/** robots.txt: every crawler, these paths kept out, and the sitemap. */
export const robotsTxt = (origin: string, disallow: ReadonlyArray<string>) =>
  [
    'User-agent: *',
    ...disallow.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${absoluteUrl(origin, '/sitemap.xml')}`,
    '',
  ].join('\n');

/** The list in pages of at most `size` (one empty page for an empty list). */
export const chunk = <A>(items: ReadonlyArray<A>, size = SITEMAP_LIMIT) => {
  const pages: A[][] = [];
  for (let i = 0; i < items.length; i += size)
    pages.push(items.slice(i, i + size));
  return pages.length > 0 ? pages : [[]];
};
