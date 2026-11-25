import { EmailSettingsPage } from '@repo/auth-pages/emails';
import { paths } from '@repo/site';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/_site/emails');

function Emails() {
  const { user, token } = route.useSearch();
  return (
    <EmailSettingsPage
      user={user ?? ''}
      token={token ?? ''}
      settingsHref={`${paths.dashboardSettings}#emails`}
    />
  );
}

export const EmailSettingsRoute = createLazyRoute('/_site/emails')({
  component: Emails,
});
