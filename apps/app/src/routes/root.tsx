import { base } from '@jsonresume/ui';
import type { ResumeProblem } from '@repo/domain';
import { NotFoundPage, SiteLayout } from '@repo/site';
import {
  createRootRouteWithContext,
  createRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';

function RootDocument() {
  return (
    <html lang="en" data-theme="system">
      <head>
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
