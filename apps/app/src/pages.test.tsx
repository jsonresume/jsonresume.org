// @vitest-environment node
// Renders through TanStack Router SSR, which needs a server environment.
import { describe, expect, it } from 'vitest';
import { createAppRenderer, livePaths, paths } from './entry-server';

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

  // Account and dashboard pages stay out of search; the dashboard is an
  // empty shell until the browser loads the session.
  const isPrivate = (path: string) =>
    /^\/(signin|signup|dashboard|forgot-password|reset-password|oauth)/.test(
      path
    );
  const isApp = (path: string) => path.startsWith('/dashboard');

  it.each(paths)(
    '%s renders with one h1, a title and a canonical link',
    async (path) => {
      const { html, status } = await page(path);
      expect(status).toBe(200);
      expect(html).toMatch(/<title>[^<]+<\/title>/);
      if (!isApp(path)) expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
      if (isPrivate(path)) {
        expect(html).toContain('<meta name="robots" content="noindex"/>');
        expect(html).not.toContain('rel="canonical"');
      } else {
        expect(html).toContain(
          `<link rel="canonical" href="https://jsonresume.org${path}"`
        );
      }
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
        // Built assets; under test, Vite serves them from /@fs.
        if (
          target.startsWith('/assets/') ||
          target.startsWith('/@fs/') ||
          target === '/favicon.svg'
        )
          continue;
        // Resumes (/@name, its formats and timeline), jobs, Explore and the
        // API are served live, not prerendered.
        const ok =
          paths.includes(target) ||
          livePaths.includes(target) ||
          target.startsWith('/api/') ||
          /^\/jobs(\/\d+)?$/.test(target) ||
          /^\/@[a-z0-9-]+(\.[a-z]+|\/timeline)?$/.test(target) ||
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
    // A bare name is probably someone's resume, which lives at /@name.
    const { html } = await page('/nope');
    expect(html).toContain('Looking for @nope?');
    expect(html).toContain('href="/@nope"');
  });
});
