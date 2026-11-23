import { CompanyPage, JobBoardPage, JobPage } from '@repo/job-board';
import { paths } from '@repo/site';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const board = getRouteApi('/_site/jobs');
const job = getRouteApi('/_site/jobs/$id');
const company = getRouteApi('/_site/jobs/companies/$slug');

export const JobsRoute = createLazyRoute('/_site/jobs')({
  component: () => (
    <JobBoardPage
      board={board.useLoaderData()}
      links={{ job: paths.job, matches: paths.dashboardJobs }}
    />
  ),
});

export const JobRoute = createLazyRoute('/_site/jobs/$id')({
  component: () => (
    <JobPage
      job={job.useLoaderData()}
      boardHref={paths.jobs}
      ask={paths.pathways}
    />
  ),
});

export const CompanyRoute = createLazyRoute('/_site/jobs/companies/$slug')({
  component: () => (
    <CompanyPage
      profile={company.useLoaderData()}
      boardHref={paths.jobs}
      jobHref={paths.job}
    />
  ),
});
