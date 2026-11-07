import { postSlugs } from '@repo/content/slugs';

const documents = () => import('@repo/content/documents');
import { blogPosting, pageHead, paths } from '@repo/site';
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
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { post } = loaderData;
    const path = paths.post(post.slug);
    return pageHead({
      title: post.title,
      description:
        post.description ?? `${post.title}, from the JSON Resume blog.`,
      path,
      type: 'article',
      parents: [{ name: 'Blog', path: paths.blog }],
      jsonLd: [blogPosting({ ...post, path })],
    });
  },
}).lazy(() => import('./blog.lazy').then((m) => m.PostRoute));

/** Every post's path, for prerendering. */
export const postPaths = postSlugs.map((slug) => paths.post(slug));
