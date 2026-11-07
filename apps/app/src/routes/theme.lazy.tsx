import { ThemePage } from '@repo/site/theme';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/_site/themes/$slug');

function Theme() {
  const { theme, similar } = route.useLoaderData();
  return <ThemePage theme={theme} similar={similar} />;
}

export const Route = createLazyRoute('/_site/themes/$slug')({
  component: Theme,
});
