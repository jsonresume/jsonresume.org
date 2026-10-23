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
import { resumeRoute } from './routes/resume';
import { rootRoute, type RouterContext } from './routes/root';

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
  resumeRoute,
]);

/**
 * A fresh router: per request on the server (with what that request found,
 * as context), once in the browser.
 */
export function createAppRouter(context: RouterContext = {}) {
  return createRouter({ routeTree, context, scrollRestoration: true });
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
