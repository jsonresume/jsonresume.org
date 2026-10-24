import { pageHead, paths } from '@repo/site';
import { createRoute, notFound, redirect } from '@tanstack/react-router';
import { siteRoute } from './root';

/** Rendered by the server per request, with the data as router context. */
const reload = (href: string) => redirect({ href, reloadDocument: true });

/**
 * /jobs. The server reads the board and renders this route with it, so the
 * page is never prerendered (see entry-server's paths).
 */
export const jobsRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.jobs,
  loader: ({ context, location }) => {
    if (context.jobBoard) return context.jobBoard;
    throw reload(location.href);
  },
  head: ({ loaderData }) =>
    pageHead({
      title: 'Jobs from Hacker News',
      description: `${
        loaderData?.jobs.length ?? 'Hundreds of'
      } open roles from Hacker News "Who is hiring?", searchable by skill, place, level and pay, and ranked against your resume.`,
      path: paths.jobs,
    }),
}).lazy(() => import('./jobs.lazy').then((m) => m.JobsRoute));

export const jobRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: '/jobs/$id',
  loader: ({ context, location }) => {
    if (context.job === null) throw notFound();
    if (context.job) return context.job;
    throw reload(location.href);
  },
  head: ({ loaderData: job }) =>
    job
      ? pageHead({
          title: `${job.title} at ${job.company}`,
          description: job.summary || `${job.title} at ${job.company}.`,
          path: paths.job(job.id),
        })
      : {},
}).lazy(() => import('./jobs.lazy').then((m) => m.JobRoute));
