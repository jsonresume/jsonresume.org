import { SchemaPage } from '@repo/site/schema';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/schema')({
  component: SchemaPage,
});
