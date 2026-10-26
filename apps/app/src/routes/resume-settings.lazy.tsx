import { ResumePage } from '@repo/dashboard';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/dashboard/resume')({
  component: ResumePage,
});
