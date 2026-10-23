import { docSlugs } from '@repo/content/slugs';
import { pageHead } from '@repo/site';
import { createRoute, notFound } from '@tanstack/react-router';
import { rootRoute } from './root';

/**
 * Every documentation page, at /<slug>. Static routes win over this param
 * route, and an unknown slug is a 404 from the loader. The document arrives
 * as loader data, so only the page being viewed is downloaded.
 */
export const docRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$doc',
  loader: async ({ params }) => {
    // Loaded on demand, so the decoding code stays out of the main bundle.
    const { loadDoc } = await import('@repo/content/documents');
    const doc = await loadDoc(params.doc);
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: loaderData.title,
          description: loaderData.description,
          path: `/${loaderData.slug}`,
        })
      : {},
}).lazy(() => import('./doc.lazy').then((m) => m.Route));

export const docPaths = docSlugs.map((slug) => `/${slug}`);
