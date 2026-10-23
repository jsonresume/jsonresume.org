// @vitest-environment node
// Renders through TanStack Router SSR, which needs a server environment.
import { describe, expect, it } from 'vitest';
import { createAppRenderer, paths } from './entry-server';

const render = createAppRenderer({ routes: {} });
const page = async (path: string) => {
  const response = await render(new Request(`https://jsonresume.org${path}`));
  return { html: await response.text(), status: response.status };
};

describe('every page', () => {
  it('covers the old site', () => {
    for (const path of [
      '/',
      '/getting-started',
      '/schema',
      '/themes',
      '/projects',
      '/team',
      '/cli',
      '/ai',
      '/theme-development',
      '/job-description-schema',
      '/media',
      '/blog',
      '/blog/first-official-release',
    ]) {
      expect(paths).toContain(path);
    }
  });

  it.each(paths)(
    '%s renders with one h1, a title and a canonical link',
    async (path) => {
      const { html, status } = await page(path);
      expect(status).toBe(200);
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
      expect(html).toMatch(/<title>[^<]+<\/title>/);
      expect(html).toContain(
        `<link rel="canonical" href="https://jsonresume.org${path}"`
      );
    }
  );

  it('links only to pages and files that exist', async () => {
    const { existsSync } = await import('node:fs');
    const publicDir = new URL('../public', import.meta.url).pathname;
    const broken: string[] = [];
    for (const path of paths) {
      const { html } = await page(path);
      for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
        const target = href.replace(/\/$/, '') || '/';
        if (target.startsWith('/assets/') || target === '/favicon.svg')
          continue;
        // Resumes (/@name) are served live, not prerendered.
        const ok =
          paths.includes(target) ||
          /^\/@[a-z0-9-]+$/.test(target) ||
          existsSync(publicDir + target);
        if (!ok) broken.push(`${path} -> ${href}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('answers unknown pages and unknown posts with 404, noindex', async () => {
    for (const path of ['/nope', '/blog/no-such-post']) {
      const { html, status } = await page(path);
      expect(status).toBe(404);
      expect(html).toMatch(/^<!DOCTYPE html><html/i);
      expect(html).toContain('<h1');
      expect(html).toContain('Page not found');
      expect(html).toContain('content="noindex"');
    }
  });
});
