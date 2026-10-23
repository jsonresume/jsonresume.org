import { CliPage } from '@repo/site/cli';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/cli')({ component: CliPage });
