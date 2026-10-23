import { MediaPage } from '@repo/site/media';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/media')({ component: MediaPage });
