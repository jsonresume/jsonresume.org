import type { AnyRoute, Manifest } from '@tanstack/react-router';
import {
  createRenderer,
  devRouterManifest,
  routerManifestFromVite,
  staticPaths,
  type ViteManifest,
} from '@repo/ssg/server';
import { createAppRouter } from './router';
import type { RouterContext } from './routes/root';
import { postPaths } from './routes/blog';

/** The client entry, as Vite's manifest keys it. */
export const clientEntry = 'src/entry-client.tsx';

/** Server rendering with the built assets (prerender and the live server). */
export const createAppRenderer = (manifest: Manifest) =>
  createRenderer<ReturnType<typeof createAppRouter>, RouterContext>({
    createRouter: createAppRouter,
    manifest,
  });

/**
 * The built client's assets for every route: Vite's manifest, and the lazy
 * page module behind each route id (.vite/lazy-routes.json, see lazyRoutes).
 */
export const appManifest = (
  vite: ViteManifest,
  routes: Readonly<Record<string, string>>
) => {
  const routesById: Record<string, AnyRoute> = createAppRouter().routesById;
  // A child whose page is in its parent's module (the dashboard's pages) is
  // already covered by the parent's preloads.
  const inherited = (id: string) => {
    for (let r = routesById[id]?.parentRoute; r; r = r.parentRoute) {
      if (routes[r.id] === routes[id]) return true;
    }
    return false;
  };
  const own = Object.entries(routes).filter(([id]) => !inherited(id));
  return routerManifestFromVite(
    vite,
    clientEntry,
    '/',
    Object.fromEntries(own)
  );
};

/** Server rendering for `pnpm dev`, with Vite serving source modules. */
export const render = createAppRenderer(devRouterManifest(clientEntry));

/** Rendered per request by the server, never prerendered. */
export const livePaths = ['/jobs', '/explore'];

/** Every page to prerender: each static route, plus each blog post. */
export const paths = [
  ...staticPaths(createAppRouter().routesByPath).filter(
    (path) => !livePaths.includes(path)
  ),
  ...postPaths,
];

export { prerender } from '@repo/ssg/server';
export { LAZY_ROUTES_FILE } from '@repo/ssg/vite';
