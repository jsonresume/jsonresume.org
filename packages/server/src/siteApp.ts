import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

export interface MountedHandler {
  /** Path prefix, e.g. '/api'. Requests under it go to `fetch`. */
  prefix: string;
  fetch: (request: Request) => Promise<Response>;
}

export interface SiteAppOptions {
  /** Absolute path of the built client: prerendered pages and /assets. */
  clientDir: string;
  /** Handlers mounted ahead of static files, e.g. the Effect API. */
  mount?: ReadonlyArray<MountedHandler>;
}

const HTML_CACHE = 'public, max-age=0, must-revalidate';
const IMMUTABLE = 'public, max-age=31536000, immutable';
const STATIC_CACHE = 'public, max-age=86400';

const hasExtension = (path: string) => /\.[a-z0-9]+$/i.test(path);

/**
 * A Hono app serving a prerendered site: '/schema' serves schema/index.html,
 * fingerprinted /assets are cached forever, '/schema/' redirects to
 * '/schema', and anything unknown gets the site's 404.html with status 404.
 */
export function createSiteApp({ clientDir, mount = [] }: SiteAppOptions): Hono {
  // serveStatic resolves `root` against the working directory.
  const root = relative(process.cwd(), clientDir) || '.';
  const notFoundPage = readFileSync(join(clientDir, '404.html'), 'utf8');
  const app = new Hono();

  for (const { prefix, fetch } of mount) {
    app.all(`${prefix}/*`, (c) => fetch(c.req.raw));
    app.all(prefix, (c) => fetch(c.req.raw));
  }

  app.use('*', async (c, next) => {
    const { pathname, search } = new URL(c.req.url);
    if (pathname.length > 1 && pathname.endsWith('/')) {
      return c.redirect(pathname.replace(/\/+$/, '') + search, 308);
    }
    return next();
  });

  // Set after the response exists: serveStatic's onFound runs too late to
  // add headers to the response it returns.
  app.use('*', async (c, next) => {
    await next();
    if (c.res.status !== 200 || c.res.headers.has('Cache-Control')) return;
    const html = c.res.headers.get('Content-Type')?.startsWith('text/html');
    c.res.headers.set(
      'Cache-Control',
      c.req.path.startsWith('/assets/')
        ? IMMUTABLE
        : html
        ? HTML_CACHE
        : STATIC_CACHE
    );
  });

  app.use(
    '*',
    serveStatic({
      root,
      rewriteRequestPath: (path) =>
        hasExtension(path) ? path : `${path === '/' ? '' : path}/index.html`,
    })
  );

  app.notFound((c) => c.html(notFoundPage, 404));
  return app;
}
