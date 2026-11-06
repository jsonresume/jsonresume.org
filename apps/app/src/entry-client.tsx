import '@jsonresume/ui/fonts.css';
import '@jsonresume/ui/styles.css';
import { startPostHog } from '@repo/posthog/browser';
import { hydrateRouter } from '@repo/ssg/browser';
import { createAppRouter } from './router';

hydrateRouter(createAppRouter());
startPostHog(
  import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.posthog.com'
);
