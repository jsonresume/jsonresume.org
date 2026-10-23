/**
 * Render every static route to HTML after `vite build`, so pages arrive with
 * real content for search engines and link previews, then hydrate.
 * Run by `pnpm build`; reads dist/ssr, writes into dist/client.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type ServerEntry = typeof import('../src/entry-server.tsx');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = join(root, 'dist/client');
const entry = pathToFileURL(join(root, 'dist/ssr/entry-server.js')).href;
const ssr: ServerEntry = await import(entry);

const template = await readFile(join(clientDir, 'index.html'), 'utf8');

function page(route: ServerEntry['notFound']): string {
  return template
    .replace('<!--app-head-->', ssr.renderHead(route))
    .replace('<!--app-html-->', ssr.render(route))
    .replace('<body>', `<body class="${ssr.bodyClass}">`);
}

async function write(file: string, html: string) {
  const path = join(clientDir, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, html);
  process.stdout.write(`prerendered ${file}\n`);
}

for (const route of ssr.routes) {
  const file =
    route.path === '/' ? 'index.html' : join(route.path.slice(1), 'index.html');
  await write(file, page(route));
}
await write('404.html', page(ssr.notFound));
