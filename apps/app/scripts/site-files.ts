/**
 * Files around the pages, written after prerendering: robots.txt and the
 * prerendered pages' sitemap (the server's /sitemap.xml indexes it with the
 * live ones: jobs and resumes, see server/sitemaps.ts), and the old
 * homepage's public files the new site doesn't replace (theme PNGs linked
 * from theme READMEs and elsewhere), so their URLs keep working.
 */
import { robotsTxt, urlSet } from '@repo/server/sitemap';
import { cp, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ORIGIN = 'https://jsonresume.org';
/** Account pages, the dashboard and OAuth consent stay out of search. */
const PRIVATE =
  /^\/(signin|signup|forgot-password|reset-password|dashboard|oauth)(\/|$)/;
/** What crawlers skip: the signed-in app, the API, consent, analytics. */
export const DISALLOW = ['/api/', '/dashboard', '/oauth/', '/ingest/'];

/** The prerendered and live pages search engines should find. */
export const publicPaths = (paths: ReadonlyArray<string>) =>
  paths.filter((path) => !PRIVATE.test(path) && path !== '/404');

export async function writeSiteFiles(
  clientDir: string,
  paths: ReadonlyArray<string>,
  legacyDir: string
) {
  await writeFile(
    join(clientDir, 'sitemap-pages.xml'),
    urlSet(
      ORIGIN,
      publicPaths(paths).map((path) => ({ path }))
    )
  );
  await writeFile(join(clientDir, 'robots.txt'), robotsTxt(ORIGIN, DISALLOW));
  return copyMissing(legacyDir, clientDir);
}

/** Copy files from `from` that `to` doesn't have; how many were copied. */
async function copyMissing(from: string, to: string): Promise<number> {
  let copied = 0;
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const source = join(from, entry.name);
    const target = join(to, entry.name);
    if (entry.isDirectory()) copied += await copyMissing(source, target);
    else if (!(await stat(target).catch(() => undefined))) {
      await cp(source, target);
      copied += 1;
    }
  }
  return copied;
}
