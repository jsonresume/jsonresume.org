import { StartPage } from '@repo/resume-editor/start';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/start')({
  component: StartPage,
});
