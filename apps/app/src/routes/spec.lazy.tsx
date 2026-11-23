import { DocPage } from '@repo/site/doc';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const resume = getRouteApi('/_site/spec');
const job = getRouteApi('/_site/spec/job');
const company = getRouteApi('/_site/spec/company');

export const SpecRoute = createLazyRoute('/_site/spec')({
  component: () => <DocPage doc={resume.useLoaderData()} />,
});

export const JobSpecRoute = createLazyRoute('/_site/spec/job')({
  component: () => <DocPage doc={job.useLoaderData()} />,
});

export const CompanySpecRoute = createLazyRoute('/_site/spec/company')({
  component: () => <DocPage doc={company.useLoaderData()} />,
});
