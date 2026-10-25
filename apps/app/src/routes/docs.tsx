import { pageHead } from '@repo/site';
import { createRoute, notFound } from '@tanstack/react-router';
import { siteRoute } from './root';

const documents = () => import('@repo/content/documents');

/** A Markdown document at /<slug> (packages/content/src/docs). */
const docRoute = <const Path extends string>(path: Path) =>
  createRoute({
    getParentRoute: () => siteRoute,
    path,
    loader: async () => {
      const doc = await (await documents()).loadDoc(path.slice(1));
      if (!doc) throw notFound();
      return doc;
    },
    head: ({ loaderData }) =>
      loaderData
        ? pageHead({
            title: loaderData.title,
            description: loaderData.description,
            path,
          })
        : {},
  });

export const privacyRoute = docRoute('/privacy').lazy(() =>
  import('./docs.lazy').then((m) => m.PrivacyRoute)
);
export const termsRoute = docRoute('/terms').lazy(() =>
  import('./docs.lazy').then((m) => m.TermsRoute)
);
