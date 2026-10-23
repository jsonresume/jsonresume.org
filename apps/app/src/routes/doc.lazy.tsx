import { DocPage } from '@repo/site/doc';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/$doc');

export const Route = createLazyRoute('/$doc')({
  component: function DocRoute() {
    return <DocPage doc={route.useLoaderData()} />;
  },
});
