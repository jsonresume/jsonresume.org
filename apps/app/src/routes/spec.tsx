import { pageHead, paths } from '@repo/site';
import { createRoute } from '@tanstack/react-router';
import { siteRoute } from './root';

type SpecName = 'resume' | 'job' | 'company';
const spec = () => import('@repo/content/spec');

/** A specification at `path`, from @jsonresume/schema (prerendered). */
const specRoute = <const Path extends string>(path: Path, name: SpecName) =>
  createRoute({
    getParentRoute: () => siteRoute,
    path,
    loader: async () => (await spec()).loadSpec(name),
    head: ({ loaderData }) =>
      loaderData
        ? pageHead({
            title: loaderData.title,
            description: loaderData.description,
            path,
            ...(name === 'resume'
              ? {}
              : {
                  parents: [{ name: 'Specification', path: paths.spec }],
                  crumb: loaderData.title,
                }),
          })
        : {},
  });

export const resumeSpecRoute = specRoute(paths.spec, 'resume').lazy(() =>
  import('./spec.lazy').then((m) => m.SpecRoute)
);
export const jobSpecRoute = specRoute(paths.specJob, 'job').lazy(() =>
  import('./spec.lazy').then((m) => m.JobSpecRoute)
);
export const companySpecRoute = specRoute(paths.specCompany, 'company').lazy(
  () => import('./spec.lazy').then((m) => m.CompanySpecRoute)
);
