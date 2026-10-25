import { pageHead, paths } from '@repo/site';
import { createRoute, redirect } from '@tanstack/react-router';
import { siteRoute } from './root';

/**
 * /@username/timeline. The server reads the resume and renders this route
 * with its timeline as router context, or with the problem.
 */
export const timelineRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: '/@{$handle}/timeline',
  loader: ({ context, location }) => {
    if (context.timeline)
      return { kind: 'timeline' as const, ...context.timeline };
    if (context.resumeProblem)
      return { kind: 'problem' as const, problem: context.resumeProblem };
    throw redirect({ href: location.href, reloadDocument: true });
  },
  head: ({ loaderData }) =>
    loaderData?.kind === 'timeline'
      ? pageHead({
          title: `${loaderData.timeline.name}’s timeline`,
          description: `${loaderData.timeline.name}${
            loaderData.timeline.label ? `, ${loaderData.timeline.label}` : ''
          }: every role, school and project in order, on JSON Resume.`,
          path: paths.timeline(loaderData.username),
        })
      : { meta: [{ title: 'Timeline · JSON Resume' }] },
}).lazy(() => import('./timeline.lazy').then((m) => m.Route));
