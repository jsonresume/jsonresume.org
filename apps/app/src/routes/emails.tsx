import { paths } from '@repo/site';
import { createRoute } from '@tanstack/react-router';
import { Predicate } from 'effect';
import { siteRoute } from './root';

/** ?user= and ?token= from the email's link; Predicate keeps Schema out. */
const Search = (search: Record<string, unknown>) => ({
  ...(Predicate.isString(search['user']) ? { user: search['user'] } : {}),
  ...(Predicate.isString(search['token']) ? { token: search['token'] } : {}),
});

/** Every email's settings link: kept out of search. */
export const emailSettingsRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.emailSettings,
  validateSearch: Search,
  head: () => ({
    meta: [
      { title: 'Email settings · JSON Resume' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
}).lazy(() => import('./emails.lazy').then((m) => m.EmailSettingsRoute));
