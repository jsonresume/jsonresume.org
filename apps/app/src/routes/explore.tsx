import { pageHead, paths } from '@repo/site';
import { createRoute, redirect } from '@tanstack/react-router';
import { siteRoute } from './root';

/**
 * /explore. The server searches (?q=, ?page=) and renders this route with
 * the results as router context, so it is never prerendered.
 */
export const exploreRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.explore,
  loader: ({ context, location }) => {
    if (context.explore) return context.explore;
    throw redirect({ href: location.href, reloadDocument: true });
  },
  head: ({ loaderData }) =>
    pageHead({
      title: loaderData?.query
        ? `“${loaderData.query}” · Explore resumes`
        : 'Explore resumes',
      description: `Search ${
        loaderData ? loaderData.total.toLocaleString('en') : 'thousands of'
      } public resumes on JSON Resume by skill, role, place, name and employer.`,
      path: paths.explore,
    }),
}).lazy(() => import('./explore.lazy').then((m) => m.Route));
