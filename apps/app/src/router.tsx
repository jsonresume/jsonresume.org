import { createRouter } from '@tanstack/react-router';
import { blogRoute, postRoute } from './routes/blog';
import { docRoute } from './routes/docs';
import {
  homeRoute,
  projectsRoute,
  teamRoute,
  themesRoute,
} from './routes/pages';
import { rootRoute } from './routes/root';

export const routeTree = rootRoute.addChildren([
  homeRoute,
  themesRoute,
  projectsRoute,
  teamRoute,
  blogRoute,
  postRoute,
  docRoute,
]);

/** A fresh router: per request on the server, once in the browser. */
export function createAppRouter() {
  return createRouter({ routeTree, scrollRestoration: true });
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
