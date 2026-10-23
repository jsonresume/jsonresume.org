import { ThemeDevelopmentPage } from '@repo/site/theme-development';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/theme-development')({
  component: ThemeDevelopmentPage,
});
