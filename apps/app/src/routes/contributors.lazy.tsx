import { contributors } from '@repo/contributors';
import { ContributorsPage } from '@repo/contributors/ui';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/contributors')({
  component: () => <ContributorsPage data={contributors} />,
});
