import { ResumeUnavailablePage } from '@repo/site/resume-unavailable';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const resume = getRouteApi('/@{$handle}');

export const Route = createLazyRoute('/@{$handle}')({
  component: function ResumeRoute() {
    return <ResumeUnavailablePage problem={resume.useLoaderData()} />;
  },
});
