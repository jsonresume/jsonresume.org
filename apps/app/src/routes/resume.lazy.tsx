import { ResumeUnavailablePage } from '@repo/site/resume-unavailable';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const resume = getRouteApi('/_site/@{$handle}');

export const Route = createLazyRoute('/_site/@{$handle}')({
  component: function ResumeRoute() {
    return <ResumeUnavailablePage problem={resume.useLoaderData()} />;
  },
});
