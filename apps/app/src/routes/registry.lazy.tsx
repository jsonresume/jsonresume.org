import { RegistryPage } from '@repo/site/registry';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/registry')({
  component: RegistryPage,
});
