// @vitest-environment node
import type { JobSummary, ResumeListing } from '@repo/api';
import { Explore } from '@repo/explore';
import { JobBoard } from '@repo/jobs';
import { createSiteApp } from '@repo/server';
import { chunk } from '@repo/server/sitemap';
import { Effect, Layer } from 'effect';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { paths as prerendered, livePaths } from '../src/entry-server';
import { DISALLOW, writeSiteFiles } from '../scripts/site-files';
import { createSitemaps, liveSitemapPath, sitemapPath } from './sitemaps';

const listing = (username: string, updatedAt: string | null = null) =>
  ({
    username,
    name: username,
    label: null,
    location: null,
    image: null,
    skills: [],
    updatedAt,
  } satisfies ResumeListing);

const job = (id: number): JobSummary => ({
  id,
  title: 'Engineer',
  company: 'Acme',
  location: null,
  remote: 'onsite',
  remoteRegions: [],
  seniority: 'mid',
  employmentType: 'full_time',
  salary: null,
  salaryMin: null,
  salaryMax: null,
  skills: [],
  postedAt: '2026-11-02T12:00:00.000Z',
  months: 1,
});

const unused = Effect.die('not used by the sitemap');
const services = (people: ReadonlyArray<ResumeListing>) =>
  Layer.mergeAll(
    Layer.succeed(
      Explore,
      Explore.of({
        search: () => unused,
        listings: Effect.succeed(people),
        listed: () => unused,
        setListed: () => unused,
      })
    ),
    Layer.succeed(
      JobBoard,
      JobBoard.of({
        board: Effect.succeed({ jobs: [job(41), job(42)], thread: null }),
        job: () => unused,
        find: () => unused,
        status: unused,
      })
    )
  );

const dir = await mkdtemp(join(tmpdir(), 'sitemaps-'));
const legacy = await mkdtemp(join(tmpdir(), 'legacy-'));
await writeFile(join(dir, '404.html'), 'not found');
await writeSiteFiles(dir, [...prerendered, ...livePaths], legacy);

const people = [
  listing('zed'),
  listing('ada', '2026-10-01T09:00:00.000Z'),
  listing('bo'),
];
const sitemaps = createSitemaps('https://jsonresume.org', services(people));
const app = createSiteApp({
  clientDir: dir,
  dynamic: [
    { path: sitemapPath, fetch: sitemaps.index },
    { path: liveSitemapPath, fetch: sitemaps.file },
  ],
});
afterAll(() => sitemaps.dispose());

const get = async (path: string) => {
  const res = await app.request(`https://jsonresume.org${path}`);
  return {
    status: res.status,
    type: res.headers.get('content-type'),
    text: await res.text(),
  };
};
const locs = (xml: string) =>
  [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) => loc);

describe('/sitemap.xml', () => {
  it('indexes the pages, the open jobs and the listed resumes', async () => {
    const { status, type, text } = await get('/sitemap.xml');
    expect(status).toBe(200);
    expect(type).toContain('application/xml');
    expect(locs(text)).toEqual([
      'https://jsonresume.org/sitemap-pages.xml',
      'https://jsonresume.org/sitemap-jobs.xml',
      'https://jsonresume.org/sitemap-resumes-1.xml',
    ]);
  });

  it('lists every public page, and no private one', async () => {
    const { status, text } = await get('/sitemap-pages.xml');
    expect(status).toBe(200);
    const urls = locs(text);
    for (const path of [
      '/',
      '/themes',
      '/schema',
      '/mcp',
      '/blog',
      '/blog/first-official-release',
      '/privacy',
      '/jobs',
      '/explore',
    ])
      expect(urls).toContain(
        `https://jsonresume.org${path === '/' ? '/' : path}`
      );
    for (const url of urls)
      expect(url).not.toMatch(
        /\/(signin|signup|dashboard|oauth|forgot-password|reset-password|404)/
      );
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('lists open jobs with their dates', async () => {
    const { text } = await get('/sitemap-jobs.xml');
    expect(locs(text)).toEqual([
      'https://jsonresume.org/jobs/41',
      'https://jsonresume.org/jobs/42',
    ]);
    expect(text).toContain('<lastmod>2026-11-02</lastmod>');
  });

  it('lists the resumes Explore lists, in a stable order', async () => {
    const { text } = await get('/sitemap-resumes-1.xml');
    expect(locs(text)).toEqual([
      'https://jsonresume.org/@ada',
      'https://jsonresume.org/@bo',
      'https://jsonresume.org/@zed',
    ]);
    expect(text).toContain(
      '<url><loc>https://jsonresume.org/@ada</loc><lastmod>2026-10-01</lastmod></url>'
    );
    expect((await get('/sitemap-resumes-2.xml')).status).toBe(404);
    expect((await get('/sitemap-other.xml')).status).toBe(404);
  });

  it('splits many resumes into several files', async () => {
    const many = Array.from({ length: 40_001 }, (_, i) => listing(`p${i}`));
    const big = createSitemaps('https://jsonresume.org', services(many));
    const index = locs(await (await big.index()).text());
    expect(index.filter((l) => l?.includes('resumes'))).toHaveLength(
      chunk(many).length
    );
    const second = await big.file(
      new Request('https://jsonresume.org/sitemap-resumes-2.xml')
    );
    expect(locs((await second?.text()) ?? '')).toHaveLength(1);
    await big.dispose();
  });
});

describe('/robots.txt', () => {
  it('keeps crawlers out of the app and the API, and names the sitemap', async () => {
    const robots = await readFile(join(dir, 'robots.txt'), 'utf8');
    for (const path of DISALLOW)
      expect(robots).toContain(`Disallow: ${path}\n`);
    expect(DISALLOW).toEqual(
      expect.arrayContaining(['/api/', '/dashboard', '/oauth/'])
    );
    expect(robots).toContain('Sitemap: https://jsonresume.org/sitemap.xml');
    expect((await get('/robots.txt')).status).toBe(200);
  });
});
