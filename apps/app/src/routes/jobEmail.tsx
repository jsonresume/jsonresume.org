import { paths } from '@repo/site';
import { createRoute } from '@tanstack/react-router';
import { Predicate } from 'effect';
import { siteRoute } from './root';

/** ?user= and ?token= from the email's link; Predicate keeps Schema out. */
const Search = (search: Record<string, unknown>) => ({
  ...(Predicate.isString(search['user']) ? { user: search['user'] } : {}),
  ...(Predicate.isString(search['token']) ? { token: search['token'] } : {}),
});

/** The weekly jobs email's "stop" link: kept out of search. */
export const jobEmailStopRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.jobEmailStop,
  validateSearch: Search,
  head: () => ({
    meta: [
      { title: 'Stop the weekly jobs email · JSON Resume' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
}).lazy(() => import('./jobEmail.lazy').then((m) => m.JobEmailStopRoute));
