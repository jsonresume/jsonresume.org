import { base } from '@jsonresume/ui';
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { notFound, routes, type Route } from './routes';
import { siteUrl } from './site';

export { notFound, routes };

/** Class for <body>: the design system's document base. */
export const bodyClass = base;

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Title, description, canonical link and social preview tags for a route. */
export function renderHead(route: Route): string {
  const title = escape(route.title);
  const description = escape(route.description);
  const url = escape(`${siteUrl}${route.path === '/' ? '/' : route.path}`);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    route === notFound ? '<meta name="robots" content="noindex" />' : '',
    route === notFound ? '' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="JSON Resume" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ]
    .filter(Boolean)
    .join('\n    ');
}

export function render(route: Route): string {
  return renderToString(
    <StrictMode>
      <App route={route} />
    </StrictMode>
  );
}
