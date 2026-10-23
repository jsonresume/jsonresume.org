import { ThemesPage } from '@repo/site/themes';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/themes')({
  component: ThemesPage,
});
