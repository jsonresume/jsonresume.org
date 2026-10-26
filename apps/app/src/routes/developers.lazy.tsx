import { DevelopersPage } from '@repo/site/developers';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/developers')({
  component: DevelopersPage,
});
