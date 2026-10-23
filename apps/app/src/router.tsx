import { createRouter } from '@tanstack/react-router';
import { blogRoute, postRoute } from './routes/blog';
import {
  aiRoute,
  cliRoute,
  gettingStartedRoute,
  homeRoute,
  jobSchemaRoute,
  mediaRoute,
  projectsRoute,
  schemaRoute,
  teamRoute,
  themeDevelopmentRoute,
  themesRoute,
} from './routes/pages';
import { rootRoute } from './routes/root';

export const routeTree = rootRoute.addChildren([
  homeRoute,
  gettingStartedRoute,
  schemaRoute,
  jobSchemaRoute,
  cliRoute,
  aiRoute,
  themesRoute,
  themeDevelopmentRoute,
  projectsRoute,
  teamRoute,
  mediaRoute,
  blogRoute,
  postRoute,
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
