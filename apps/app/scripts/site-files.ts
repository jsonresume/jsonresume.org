/**
 * Files around the pages, written after prerendering: robots.txt and
 * sitemap.xml, and the old homepage's public files the new site doesn't
 * replace (theme PNGs linked from theme READMEs and elsewhere), so their
 * URLs keep working.
 */
import { cp, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ORIGIN = 'https://jsonresume.org';
/** Account pages, the dashboard and OAuth consent stay out of search. */
const PRIVATE =
  /^\/(signin|signup|forgot-password|reset-password|dashboard|oauth)(\/|$)/;

export async function writeSiteFiles(
  clientDir: string,
  paths: ReadonlyArray<string>,
  legacyDir: string
) {
  const urls = paths.filter((path) => !PRIVATE.test(path) && path !== '/404');
  await writeFile(
    join(clientDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(
        (path) => `  <url><loc>${ORIGIN}${path === '/' ? '' : path}</loc></url>`
      )
      .join('\n')}\n</urlset>\n`
  );
  await writeFile(
    join(clientDir, 'robots.txt'),
    [
      'User-agent: *',
      'Disallow: /api/',
      'Disallow: /dashboard',
      '',
      `Sitemap: ${ORIGIN}/sitemap.xml`,
      '',
    ].join('\n')
  );
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
