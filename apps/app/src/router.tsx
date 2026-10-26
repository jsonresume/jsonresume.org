import { createRouter } from '@tanstack/react-router';
import { blogRoute, postRoute } from './routes/blog';
import {
  aiRoute,
  cliRoute,
  developersRoute,
  gettingStartedRoute,
  homeRoute,
  jobSchemaRoute,
  mcpRoute,
  mediaRoute,
  projectsRoute,
  registryRoute,
  schemaRoute,
  teamRoute,
  themeDevelopmentRoute,
  themesRoute,
} from './routes/pages';
import {
  dashboardRoute,
  editorRoute,
  jobsMatchesRoute,
  overviewRoute,
  pathwaysRoute,
  resumeSettingsRoute,
  settingsRoute,
} from './routes/app';
import {
  authorizeRoute,
  chooseUsernameRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  signInRoute,
  signUpRoute,
} from './routes/auth';
import { privacyRoute, termsRoute } from './routes/docs';
import { exploreRoute } from './routes/explore';
import { jobRoute, jobsRoute } from './routes/jobs';
import { resumeRoute } from './routes/resume';
import { timelineRoute } from './routes/timeline';
import { rootRoute, siteRoute, type RouterContext } from './routes/root';

export const routeTree = rootRoute.addChildren([
  siteRoute.addChildren([
    homeRoute,
    gettingStartedRoute,
    schemaRoute,
    jobSchemaRoute,
    cliRoute,
    developersRoute,
    aiRoute,
    themesRoute,
    themeDevelopmentRoute,
    projectsRoute,
    teamRoute,
    mediaRoute,
    mcpRoute,
    registryRoute,
    jobsRoute,
    jobRoute,
    exploreRoute,
    privacyRoute,
    termsRoute,
    blogRoute,
    postRoute,
    resumeRoute,
    timelineRoute,
    signInRoute,
    signUpRoute,
    chooseUsernameRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
    authorizeRoute,
  ]),
  dashboardRoute.addChildren([
    overviewRoute,
    editorRoute,
    resumeSettingsRoute,
    jobsMatchesRoute,
    pathwaysRoute,
    settingsRoute,
  ]),
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
