import { facts } from '@repo/content/facts';
import { pageHead, paths } from '@repo/site';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root';

// Route definitions (path, head) stay small; each page's component is a
// separate chunk loaded with .lazy().

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: paths.home,
  head: () =>
    pageHead({
      title: 'JSON Resume: the open standard for resumes',
      description: `Write your resume once in JSON and publish it anywhere: ${facts.themeCount} open-source themes, a CLI, and free hosting from a GitHub gist.`,
      path: paths.home,
    }),
}).lazy(() => import('./home.lazy').then((m) => m.Route));

export const themesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: paths.themes,
  head: () =>
    pageHead({
      title: 'Themes',
      description: `Browse ${facts.themeCount} open-source resume themes and preview each with a real resume.`,
      path: paths.themes,
    }),
}).lazy(() => import('./themes.lazy').then((m) => m.Route));

export const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: paths.projects,
  head: () =>
    pageHead({
      title: 'Projects',
      description:
        'Tools, libraries and services the community has built on JSON Resume.',
      path: paths.projects,
    }),
}).lazy(() => import('./projects.lazy').then((m) => m.Route));

export const teamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: paths.team,
  head: () =>
    pageHead({
      title: 'Team',
      description:
        'The volunteers who maintain JSON Resume, and the history of the project since 2014.',
      path: paths.team,
    }),
}).lazy(() => import('./team.lazy').then((m) => m.Route));
