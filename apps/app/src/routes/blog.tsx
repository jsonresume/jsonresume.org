import { postSlugs } from '@repo/content/slugs';

const documents = () => import('@repo/content/documents');
import { pageHead, paths } from '@repo/site';
import { createRoute, notFound } from '@tanstack/react-router';
import { siteRoute } from './root';

export const blogRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.blog,
  loader: async () => (await documents()).loadPosts(),
  head: () =>
    pageHead({
      title: 'Blog',
      description: 'Announcements and notes from the JSON Resume project.',
      path: paths.blog,
    }),
}).lazy(() => import('./blog.lazy').then((m) => m.IndexRoute));

export const postRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: '/blog/$slug',
  loader: async ({ params }) => {
    const result = await (
      await documents()
    ).loadPostWithNeighbours(params.slug);
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: loaderData.post.title,
          description:
            loaderData.post.description ??
            `${loaderData.post.title}, from the JSON Resume blog.`,
          path: paths.post(loaderData.post.slug),
          type: 'article',
        })
      : {},
}).lazy(() => import('./blog.lazy').then((m) => m.PostRoute));

/** Every post's path, for prerendering. */
export const postPaths = postSlugs.map((slug) => paths.post(slug));
