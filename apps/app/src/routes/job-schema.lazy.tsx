import { JobSchemaPage } from '@repo/site/job-schema';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/job-description-schema')({
  component: JobSchemaPage,
});
