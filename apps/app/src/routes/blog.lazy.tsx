import { BlogIndexPage, BlogPostPage } from '@repo/site/blog';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const index = getRouteApi('/_site/blog');
const post = getRouteApi('/_site/blog/$slug');

export const IndexRoute = createLazyRoute('/_site/blog')({
  component: function BlogIndexRoute() {
    return <BlogIndexPage posts={index.useLoaderData()} />;
  },
});

export const PostRoute = createLazyRoute('/_site/blog/$slug')({
  component: function PostRouteComponent() {
    return <BlogPostPage {...post.useLoaderData()} />;
  },
});
