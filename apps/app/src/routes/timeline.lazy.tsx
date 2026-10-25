import { resumeUrl } from '@repo/site';
import { ResumeUnavailablePage } from '@repo/site/resume-unavailable';
import { TimelinePage } from '@repo/timeline/ui';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/_site/@{$handle}/timeline');

export const Route = createLazyRoute('/_site/@{$handle}/timeline')({
  component: function TimelineRoute() {
    const data = route.useLoaderData();
    if (data.kind === 'problem')
      return <ResumeUnavailablePage problem={data.problem} />;
    return (
      <TimelinePage
        username={data.username}
        timeline={data.timeline}
        today={data.today}
        links={{
          page: resumeUrl(data.username),
          pdf: resumeUrl(data.username, 'pdf'),
        }}
      />
    );
  },
});
