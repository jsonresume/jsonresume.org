import { DocPage } from '@repo/site/doc';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const privacy = getRouteApi('/_site/privacy');
const terms = getRouteApi('/_site/terms');

export const PrivacyRoute = createLazyRoute('/_site/privacy')({
  component: () => <DocPage doc={privacy.useLoaderData()} />,
});

export const TermsRoute = createLazyRoute('/_site/terms')({
  component: () => <DocPage doc={terms.useLoaderData()} />,
});
