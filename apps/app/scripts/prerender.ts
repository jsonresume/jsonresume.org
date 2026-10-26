/**
 * After the client and SSR builds, render every page through TanStack
 * Router's SSR into dist/client, so pages arrive as real HTML and then
 * hydrate. Run by `pnpm build`.
 */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { writeSiteFiles } from './site-files.ts';

type ServerEntry = typeof import('../src/entry-server.tsx');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = join(root, 'dist/client');
const entry: ServerEntry = await import(
  pathToFileURL(join(root, 'dist/ssr/entry-server.js')).href
);
const readJson = async (file: string) =>
  JSON.parse(await readFile(join(clientDir, file), 'utf8'));
const viteManifest = await readJson('.vite/manifest.json');
const lazyRoutes = await readJson(entry.LAZY_ROUTES_FILE);

const pages = await entry.prerender({
  render: entry.createAppRenderer(entry.appManifest(viteManifest, lazyRoutes)),
  paths: entry.paths,
  outDir: clientDir,
  origin: 'https://jsonresume.org',
  notFoundPath: '/404',
});

for (const page of pages) {
  process.stdout.write(
    `prerendered ${page.path} -> ${page.file} (${page.status})\n`
  );
}

const copied = await writeSiteFiles(
  clientDir,
  // Live pages are in the sitemap too.
  [...entry.paths, ...entry.livePaths],
  join(root, '../homepage2/public')
);
process.stdout.write(
  `wrote sitemap.xml and robots.txt; copied ${copied} legacy public files\n`
);
