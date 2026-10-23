import { JobSchemaPage } from '@repo/site/job-schema';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/job-description-schema')({
  component: JobSchemaPage,
});
