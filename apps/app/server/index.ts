/**
 * Serves the built app: prerendered pages and hashed assets from
 * dist/client. Server routes (API, auth, resume rendering) will mount here
 * as features move into the app. Runs as jsonresume@app behind Caddy.
 */
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });
const clientDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '../dist/client'
);
// serveStatic resolves `root` against the working directory.
const root = relative(process.cwd(), clientDir) || '.';
const notFoundPage = await readFile(join(clientDir, '404.html'), 'utf8');

const app = new Hono();

app.get('/healthz', (c) => c.text('ok'));

// Vite fingerprints everything under /assets, so it can be cached forever.
app.use(
  '/assets/*',
  serveStatic({
    root,
    onFound: (_path, c) => {
      c.header('Cache-Control', 'public, max-age=31536000, immutable');
    },
  })
);

app.use(
  '*',
  serveStatic({
    root,
    onFound: (path, c) => {
      const html = path.endsWith('.html');
      c.header(
        'Cache-Control',
        html ? 'public, max-age=0, must-revalidate' : 'public, max-age=86400'
      );
    },
  })
);

app.notFound((c) => c.html(notFoundPage, 404));

app.onError((error, c) => {
  logger.error({ err: error, path: c.req.path }, 'request failed');
  return c.text('Internal Server Error', 500);
});

const port = Number(process.env.PORT ?? 3003);
const hostname = process.env.HOST ?? '127.0.0.1';
serve({ fetch: app.fetch, port, hostname }, () => {
  logger.info({ port, hostname }, 'app listening');
});

export { app };
