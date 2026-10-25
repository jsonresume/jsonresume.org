import { base } from '@jsonresume/ui';
import type { ExploreResults, Job, JobBoard } from '@repo/api';
import type { ResumeProblem } from '@repo/domain';
import { authHintScript, NotFoundPage, SiteLayout } from '@repo/site';
import type { Timeline } from '@repo/timeline';
import {
  createRootRouteWithContext,
  createRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';

function RootDocument() {
  return (
    // The pre-paint script marks <html> before React hydrates it.
    <html lang="en" data-theme="system" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: authHintScript }} />
        <HeadContent />
      </head>
      <body className={base}>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

/** What the server hands a live render; empty when prerendering. */
export interface RouterContext {
  /** Set when /@username has no resume to show (see ./resume.tsx). */
  resumeProblem?: ResumeProblem;
  /** /jobs, read for this request (see ./jobs.tsx). */
  jobBoard?: JobBoard;
  /** /jobs/:id, or null when there is no such job. */
  job?: Job | null;
  /** /explore, searched for this request (see ./explore.tsx). */
  explore?: ExploreResults;
  /** /@username/timeline, with the server's today (see ./timeline.tsx). */
  timeline?: { username: string; today: string; timeline: Timeline };
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // Every page sets its own title; this one only shows on the 404.
      { title: 'Page not found · JSON Resume' },
    ],
    links: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  }),
  component: RootDocument,
  notFoundComponent: () => (
    <SiteLayout>
      <NotFoundPage />
    </SiteLayout>
  ),
});

/**
 * The site's pages: header, navigation, footer. The dashboard (./app.tsx)
 * has its own full-screen layout instead.
 */
export const siteRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_site',
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});
