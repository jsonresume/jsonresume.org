import { AiPage } from '@repo/site/ai';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/ai')({ component: AiPage });
