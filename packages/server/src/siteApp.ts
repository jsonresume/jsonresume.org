import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { sameOrigin } from './sameOrigin';

export interface MountedHandler {
  /** Path prefix, e.g. '/api'. Requests under it go to `fetch`. */
  prefix: string;
  fetch: (request: Request) => Promise<Response>;
}

/** A live page handler: answers its requests, or passes them on (undefined). */
export interface DynamicHandler {
  /** A Hono path pattern, e.g. '/:handle{@[^/]+}'. */
  path: string;
  fetch: (request: Request) => Promise<Response | undefined>;
}

export interface SiteAppOptions {
  /** Absolute path of the built client: prerendered pages and /assets. */
  clientDir: string;
  /** Handlers mounted ahead of static files, e.g. the Effect API. */
  mount?: ReadonlyArray<MountedHandler>;
  /** Pages rendered per request, ahead of static files. */
  dynamic?: ReadonlyArray<DynamicHandler>;
  /** Paths whose writes must come from this site (see sameOrigin). */
  protect?: { prefix: string; exempt?: ReadonlyArray<string> };
  /** Whole hosts that only redirect (an old domain): host → where a URL goes now. */
  redirectHosts?: Readonly<Record<string, (url: URL) => string>>;
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
export function createSiteApp({
  clientDir,
  mount = [],
  dynamic = [],
  protect,
  redirectHosts = {},
}: SiteAppOptions): Hono {
  // serveStatic resolves `root` against the working directory.
  const root = relative(process.cwd(), clientDir) || '.';
  const notFoundPage = readFileSync(join(clientDir, '404.html'), 'utf8');
  const app = new Hono();
  app.use('*', async (c, next) => {
    const host = (c.req.header('host') ?? '').split(':')[0] ?? '';
    const to = redirectHosts[host];
    if (!to) return next();
    // 308 keeps a POST a POST (API clients); browsers get the usual 301.
    const read = c.req.method === 'GET' || c.req.method === 'HEAD';
    return c.redirect(to(new URL(c.req.url)), read ? 301 : 308);
  });
  if (protect) app.use('*', sameOrigin(protect.prefix, protect.exempt));

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

  for (const { path, fetch } of dynamic) {
    app.get(path, async (c, next) => (await fetch(c.req.raw)) ?? next());
  }

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
