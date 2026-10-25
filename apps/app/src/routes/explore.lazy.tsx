import { ExplorePage, type ExploreLinks } from '@repo/explore/ui';
import { paths, resumeUrl } from '@repo/site';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const explore = getRouteApi('/_site/explore');

const links: ExploreLinks = {
  person: (username) => resumeUrl(username),
  search: (query, page) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (page && page > 1) params.set('page', String(page));
    const search = params.toString();
    return search ? `${paths.explore}?${search}` : paths.explore;
  },
  settings: `${paths.dashboardSettings}#explore`,
};

export const Route = createLazyRoute('/_site/explore')({
  component: () => (
    <ExplorePage results={explore.useLoaderData()} links={links} />
  ),
});
