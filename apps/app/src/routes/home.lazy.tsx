import { HomePage } from '@repo/site/home';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/')({ component: HomePage });
