import { AiPage } from '@repo/site/ai';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/_site/ai')({ component: AiPage });
