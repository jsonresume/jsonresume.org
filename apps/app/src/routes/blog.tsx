import { postSlugs } from '@repo/content/slugs';

const documents = () => import('@repo/content/documents');
import { pageHead, paths } from '@repo/site';
import { createRoute, notFound } from '@tanstack/react-router';
import { rootRoute } from './root';

export const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
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
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  loader: async ({ params }) => {
    const post = await (await documents()).loadPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: loaderData.title,
          description:
            loaderData.description ??
            `${loaderData.title}, from the JSON Resume blog.`,
          path: paths.post(loaderData.slug),
          type: 'article',
        })
      : {},
}).lazy(() => import('./blog.lazy').then((m) => m.PostRoute));

/** Every post's path, for prerendering. */
export const postPaths = postSlugs.map((slug) => paths.post(slug));
