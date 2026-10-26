import { PathwaysPage } from '@repo/dashboard';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/dashboard/pathways')({
  component: PathwaysPage,
});
