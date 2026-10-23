import { base } from '@jsonresume/ui';
import { NotFoundPage, SiteLayout } from '@repo/site';
import {
  createRootRoute,
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
        <SiteLayout>
          <Outlet />
        </SiteLayout>
        <Scripts />
      </body>
    </html>
  );
}

export const rootRoute = createRootRoute({
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
  notFoundComponent: NotFoundPage,
});
