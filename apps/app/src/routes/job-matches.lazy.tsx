import { JobsPage } from '@repo/dashboard';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/dashboard/jobs')({
  component: JobsPage,
});
