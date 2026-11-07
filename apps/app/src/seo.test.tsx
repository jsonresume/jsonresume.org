// @vitest-environment node
// Renders through TanStack Router SSR, which needs a server environment.
import { describe, expect, it } from 'vitest';
import { publicPaths } from '../scripts/site-files';
import { createAppRenderer, paths } from './entry-server';

const render = createAppRenderer({ routes: {} });
const page = async (path: string) => {
  const response = await render(new Request(`https://jsonresume.org${path}`));
  return response.text();
};

type Data = Record<string, unknown> & { '@type': string };

/** Every JSON-LD block in <head>, parsed (a parse error fails the test). */
const jsonLd = (html: string): Data[] => {
  const head = html.slice(0, html.indexOf('</head>'));
  return [
    ...head.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    ),
  ].map(([, json]) => JSON.parse(json ?? ''));
};
const ofType = (html: string, type: string) =>
  jsonLd(html).find((d) => d['@type'] === type);

const meta = (html: string, key: string) =>
  new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`).exec(
    html
  )?.[1];

describe('search and link-preview tags', () => {
  const indexed = publicPaths(paths);

  it.each(indexed)(
    '%s has its description, Open Graph and Twitter tags',
    async (path) => {
      const html = await page(path);
      const url = `https://jsonresume.org${path}`;
      expect(meta(html, 'description')?.length).toBeGreaterThan(20);
      expect(meta(html, 'og:url')).toBe(url);
      expect(meta(html, 'og:title')).toBe(meta(html, 'twitter:title'));
      expect(meta(html, 'og:description')).toBe(meta(html, 'description'));
      // A theme's page previews with its screenshot; the rest, the site's card.
      const theme = /^\/themes\/([^/]+)$/.exec(path)?.[1];
      expect(meta(html, 'og:image')).toBe(
        theme
          ? `https://jsonresume.org/img/themes/${theme}.webp`
          : 'https://jsonresume.org/og.png'
      );
      expect(html.match(/rel="canonical"/g)).toHaveLength(1);
      for (const data of jsonLd(html))
        expect(data['@context']).toBe('https://schema.org');
      if (path === '/') return;
      // Every page below Home says where it sits.
      const trail = ofType(html, 'BreadcrumbList');
      const items = trail?.['itemListElement'] as Array<Data>;
      expect(items[0]).toMatchObject({
        position: 1,
        name: 'Home',
        item: 'https://jsonresume.org/',
      });
      expect(items.at(-1)).toMatchObject({ position: items.length, item: url });
    }
  );

  it('names the clean URL as canonical, whatever the query', async () => {
    for (const [path, clean] of [
      ['/themes?theme=elegant', '/themes'],
      ['/themes?style=modern&layout=two-column', '/themes'],
      ['/schema?utm_source=x', '/schema'],
      ['/mcp?client=cursor', '/mcp'],
    ]) {
      const html = await page(path);
      expect(html).toContain(
        `<link rel="canonical" href="https://jsonresume.org${clean}"/>`
      );
    }
  });

  it('describes the site and its publisher on the home page', async () => {
    const html = await page('/');
    const site = ofType(html, 'WebSite');
    expect(site).toMatchObject({
      name: 'JSON Resume',
      url: 'https://jsonresume.org/',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          urlTemplate: 'https://jsonresume.org/explore?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    });
    expect(ofType(html, 'Organization')).toMatchObject({
      name: 'JSON Resume',
      url: 'https://jsonresume.org/',
      logo: expect.stringMatching(/^https:\/\/jsonresume\.org\//),
    });
    expect(ofType(html, 'BreadcrumbList')).toBeUndefined();
  });

  it('marks up blog posts as articles, under the blog', async () => {
    const html = await page('/blog/first-official-release');
    expect(meta(html, 'og:type')).toBe('article');
    expect(ofType(html, 'BlogPosting')).toMatchObject({
      headline: expect.any(String),
      datePublished: expect.stringMatching(/^\d{4}-\d{2}-\d{2}/),
      author: { '@type': 'Person', name: expect.any(String) },
      mainEntityOfPage: 'https://jsonresume.org/blog/first-official-release',
    });
    const items = ofType(html, 'BreadcrumbList')?.['itemListElement'];
    expect(items).toMatchObject([
      { name: 'Home' },
      { name: 'Blog', item: 'https://jsonresume.org/blog' },
      { position: 3 },
    ]);
  });

  it('gives docs a breadcrumb trail', async () => {
    const html = await page('/privacy');
    expect(ofType(html, 'BreadcrumbList')?.['itemListElement']).toMatchObject([
      { name: 'Home' },
      { item: 'https://jsonresume.org/privacy' },
    ]);
  });

  it('keeps JSON-LD from closing its script tag', async () => {
    for (const path of ['/', '/blog/first-official-release']) {
      const html = await page(path);
      for (const [, json] of html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      ))
        expect(json).not.toContain('<');
    }
  });
});
