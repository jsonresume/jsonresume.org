import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './root';

/**
 * /@username. The server answers it with the resume itself (a theme's whole
 * page, see @repo/resume-host) and renders this route only to explain why
 * there is none, passing the problem as router context.
 */
export const resumeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/@{$handle}',
  loader: ({ context, location }) => {
    if (context.resumeProblem) return context.resumeProblem;
    // Followed from inside the app: resumes are documents, so load it whole.
    throw redirect({ href: location.href, reloadDocument: true });
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `@${loaderData.username} · JSON Resume` }]
      : [],
  }),
}).lazy(() => import('./resume.lazy').then((m) => m.Route));
