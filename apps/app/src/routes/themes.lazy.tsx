import { ThemesPage } from '@repo/site/themes';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/themes')({ component: ThemesPage });
