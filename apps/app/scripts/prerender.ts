/**
 * After the client and SSR builds, render every page through TanStack
 * Router's SSR into dist/client, so pages arrive as real HTML and then
 * hydrate. Run by `pnpm build`.
 */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type ServerEntry = typeof import('../src/entry-server.tsx');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = join(root, 'dist/client');
const entry: ServerEntry = await import(
  pathToFileURL(join(root, 'dist/ssr/entry-server.js')).href
);
const viteManifest = JSON.parse(
  await readFile(join(clientDir, '.vite/manifest.json'), 'utf8')
);

const pages = await entry.prerender({
  render: entry.createAppRenderer(
    entry.routerManifestFromVite(viteManifest, entry.clientEntry)
  ),
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
