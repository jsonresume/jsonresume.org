import { describe, expect, it } from 'vitest';
import { chunk, robotsTxt, sitemapIndex, urlSet } from './sitemap';

const locs = (xml: string) =>
  [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) => loc);

describe('sitemaps', () => {
  it('lists each page as an absolute URL, with its date when known', () => {
    const xml = urlSet('https://jsonresume.org', [
      { path: '/' },
      { path: '/blog/hello', lastmod: '2024-05-01T10:00:00.000Z' },
      { path: '/@ada', lastmod: null },
    ]);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(locs(xml)).toEqual([
      'https://jsonresume.org/',
      'https://jsonresume.org/blog/hello',
      'https://jsonresume.org/@ada',
    ]);
    expect(xml).toContain(
      '<url><loc>https://jsonresume.org/blog/hello</loc><lastmod>2024-05-01</lastmod></url>'
    );
    expect(xml.match(/<lastmod>/g)).toHaveLength(1);
  });

  it('escapes what XML needs escaped', () => {
    const xml = urlSet('https://jsonresume.org/', [{ path: "/a&b<'c'>" }]);
    expect(locs(xml)).toEqual([
      'https://jsonresume.org/a&amp;b&lt;&apos;c&apos;&gt;',
    ]);
  });

  it('indexes sitemaps', () => {
    const xml = sitemapIndex('https://jsonresume.org', [
      { path: '/sitemap-pages.xml' },
      { path: '/sitemap-resumes-1.xml' },
    ]);
    expect(xml).toContain(
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(locs(xml)).toEqual([
      'https://jsonresume.org/sitemap-pages.xml',
      'https://jsonresume.org/sitemap-resumes-1.xml',
    ]);
  });

  it('splits long lists into files the protocol allows', () => {
    expect(chunk([])).toEqual([[]]);
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk(Array.from({ length: 90_001 }, (_, i) => i))).toHaveLength(3);
  });
});

describe('robots.txt', () => {
  it('keeps crawlers out of private paths and names the sitemap', () => {
    expect(robotsTxt('https://jsonresume.org', ['/api/', '/dashboard'])).toBe(
      'User-agent: *\nDisallow: /api/\nDisallow: /dashboard\n\nSitemap: https://jsonresume.org/sitemap.xml\n'
    );
  });
});
