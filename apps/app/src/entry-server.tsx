import type { Manifest } from '@tanstack/react-router';
import {
  createRenderer,
  devRouterManifest,
  staticPaths,
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

export { prerender, routerManifestFromVite } from '@repo/ssg/server';
