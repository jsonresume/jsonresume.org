import { paths } from '@repo/site';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root';

const head = (title: string) => () => ({
  meta: [
    { title: `${title} · JSON Resume` },
    { name: 'robots', content: 'noindex' },
  ],
});

/**
 * The signed-in app, full screen (no site header or footer). Prerendered as
 * an empty shell; the session and data load in the browser.
 */
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: paths.dashboard,
}).lazy(() => import('./app.lazy').then((m) => m.DashboardRoute));

export const overviewRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  head: head('Overview'),
}).lazy(() => import('./app.lazy').then((m) => m.OverviewRoute));

export const resumeSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'resume',
  head: head('Resume'),
}).lazy(() => import('./app.lazy').then((m) => m.ResumeRoute));

export const settingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'settings',
  head: head('Settings'),
}).lazy(() => import('./app.lazy').then((m) => m.SettingsRoute));

export const editorRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'editor',
  head: head('Editor'),
}).lazy(() => import('./editor.lazy').then((m) => m.EditorRoute));

export const jobsMatchesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'jobs',
  head: head('Jobs for you'),
}).lazy(() => import('./app.lazy').then((m) => m.JobsRoute));

export const pathwaysRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: 'pathways',
  head: head('Pathways'),
}).lazy(() => import('./app.lazy').then((m) => m.PathwaysRoute));
