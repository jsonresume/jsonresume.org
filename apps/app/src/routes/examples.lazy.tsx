import { DocPage } from '@repo/site/doc';
import { ExamplePage, ExamplesPage, GuidesPage } from '@repo/site/examples';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const examples = getRouteApi('/_site/examples');
const example = getRouteApi('/_site/examples/$slug');
const guides = getRouteApi('/_site/guides');
const guide = getRouteApi('/_site/guides/$slug');

export const ExamplesRoute = createLazyRoute('/_site/examples')({
  component: () => <ExamplesPage examples={examples.useLoaderData()} />,
});
export const ExampleRoute = createLazyRoute('/_site/examples/$slug')({
  component: () => <ExamplePage example={example.useLoaderData()} />,
});
export const GuidesRoute = createLazyRoute('/_site/guides')({
  component: () => <GuidesPage guides={guides.useLoaderData()} />,
});
export const GuideRoute = createLazyRoute('/_site/guides/$slug')({
  component: () => <DocPage doc={guide.useLoaderData()} />,
});
