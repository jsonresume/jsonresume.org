import { StopEmailPage } from '@repo/job-board/stop-email';
import { paths } from '@repo/site';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/_site/jobs/email/stop');

function Stop() {
  const { user, token } = route.useSearch();
  return (
    <StopEmailPage
      user={user ?? ''}
      token={token ?? ''}
      preferencesHref={paths.dashboardJobs}
    />
  );
}

export const JobEmailStopRoute = createLazyRoute('/_site/jobs/email/stop')({
  component: Stop,
});
