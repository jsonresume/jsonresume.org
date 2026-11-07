import { pageHead, paths } from '@repo/site';
import { createRoute, notFound } from '@tanstack/react-router';
import { siteRoute } from './root';

const catalog = () => import('@repo/theme-gallery/catalog');

/** /themes/:slug, one theme's own page, prerendered for every theme. */
export const themeRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: '/themes/$slug',
  loader: async ({ params }) => {
    const { findTheme, themes } = await catalog();
    const theme = findTheme(params.slug);
    if (!theme) throw notFound();
    const similar = themes
      .filter((t) => t.style === theme.style && t.slug !== theme.slug)
      .slice(0, 4);
    return { theme, similar };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { theme } = loaderData;
    return pageHead({
      title: `${theme.name} resume theme`,
      description: theme.description,
      path: paths.theme(theme.slug),
      parents: [{ name: 'Themes', path: paths.themes }],
      crumb: theme.name,
      image: {
        path: `/img/themes/${theme.slug}.webp`,
        width: 800,
        height: 640,
      },
    });
  },
}).lazy(() => import('./theme.lazy').then((m) => m.Route));
