import { BlogIndexPage, BlogPostPage } from '@repo/site/blog';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const index = getRouteApi('/blog');
const post = getRouteApi('/blog/$slug');

export const IndexRoute = createLazyRoute('/blog')({
  component: function BlogIndexRoute() {
    return <BlogIndexPage posts={index.useLoaderData()} />;
  },
});

export const PostRoute = createLazyRoute('/blog/$slug')({
  component: function PostRouteComponent() {
    return <BlogPostPage post={post.useLoaderData()} />;
  },
});
