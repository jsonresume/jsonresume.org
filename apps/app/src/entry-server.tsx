import type { Manifest } from '@tanstack/react-router';
import {
  createRenderer,
  devRouterManifest,
  staticPaths,
} from '@repo/ssg/server';
import { createAppRouter } from './router';
import { postPaths } from './routes/blog';
import { docPaths } from './routes/docs';

/** The client entry, as Vite's manifest keys it. */
export const clientEntry = 'src/entry-client.tsx';

/** Server rendering with the built assets (prerender and the live server). */
export const createAppRenderer = (manifest: Manifest) =>
  createRenderer({ createRouter: createAppRouter, manifest });

/** Server rendering for `pnpm dev`, with Vite serving source modules. */
export const render = createAppRenderer(devRouterManifest(clientEntry));

/** Every page to prerender: each static route, each document and each post. */
export const paths = [
  ...staticPaths(createAppRouter().routesByPath),
  ...docPaths,
  ...postPaths,
];

export { prerender, routerManifestFromVite } from '@repo/ssg/server';
