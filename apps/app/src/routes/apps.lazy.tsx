import { AppsPage } from '@repo/site/apps';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/apps')({
  component: AppsPage,
});
