import { SettingsPage } from '@repo/dashboard';
import { createLazyRoute } from '@tanstack/react-router';

export const Route = createLazyRoute('/dashboard/settings')({
  component: SettingsPage,
});
