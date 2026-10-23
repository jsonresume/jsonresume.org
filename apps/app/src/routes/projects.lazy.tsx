import { ProjectsPage } from '@repo/site/projects';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/projects')({
  component: ProjectsPage,
});
