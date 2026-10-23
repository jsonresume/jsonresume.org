import { GettingStartedPage } from '@repo/site/getting-started';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/getting-started')({
  component: GettingStartedPage,
});
