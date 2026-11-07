import { pageHead, paths } from '@repo/site';
import { createRoute, notFound } from '@tanstack/react-router';
import { siteRoute } from './root';

const documents = () => import('@repo/content/documents');

/** /examples: an example resume per job title (packages/content/src/examples). */
export const examplesRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.examples,
  loader: async () => (await documents()).loadExamples(),
  head: () =>
    pageHead({
      title: 'Resume examples by job',
      description:
        'Example resumes for software engineers, nurses, teachers, accountants, sales and more, with what makes each one work. Start from one for free.',
      path: paths.examples,
    }),
}).lazy(() => import('./examples.lazy').then((m) => m.ExamplesRoute));

export const exampleRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: '/examples/$slug',
  loader: async ({ params }) => {
    const example = await (await documents()).loadExample(params.slug);
    if (!example) throw notFound();
    return example;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: `${loaderData.role} resume example`,
          description: `${loaderData.intro} Free to start from.`,
          path: paths.example(loaderData.slug),
          parents: [{ name: 'Resume examples', path: paths.examples }],
          crumb: loaderData.role,
        })
      : {},
}).lazy(() => import('./examples.lazy').then((m) => m.ExampleRoute));

/** /guides and /guides/<slug> (packages/content/src/guides). */
export const guidesRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.guides,
  loader: async () => (await documents()).loadGuides(),
  head: () =>
    pageHead({
      title: 'How to write a resume, part by part',
      description:
        'Short, practical guides to each part of a resume: the summary, work experience, skills, applicant tracking systems, length, gaps and more.',
      path: paths.guides,
    }),
}).lazy(() => import('./examples.lazy').then((m) => m.GuidesRoute));

export const guideRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: '/guides/$slug',
  loader: async ({ params }) => {
    const guide = await (await documents()).loadGuide(params.slug);
    if (!guide) throw notFound();
    return guide;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: loaderData.title,
          description: loaderData.description,
          path: paths.guide(loaderData.slug),
          type: 'article',
          parents: [{ name: 'Resume guides', path: paths.guides }],
        })
      : {},
}).lazy(() => import('./examples.lazy').then((m) => m.GuideRoute));
