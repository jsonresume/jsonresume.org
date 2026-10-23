import { CliPage } from '@repo/site/cli';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/cli')({ component: CliPage });
