import { OverviewPage } from '@repo/dashboard';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/dashboard/')({
  component: OverviewPage,
});
