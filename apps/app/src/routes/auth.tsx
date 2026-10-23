import { paths } from '@repo/site';
import { createRoute } from '@tanstack/react-router';
import { Predicate } from 'effect';
import { siteRoute } from './root';

/**
 * ?next= and ?error=, as strings or absent. Route files load on every page,
 * so this uses Predicate rather than Schema, which would bring Effect's
 * runtime into the main bundle.
 */
const Search = (search: Record<string, unknown>) => ({
  ...(Predicate.isString(search['next']) ? { next: search['next'] } : {}),
  ...(Predicate.isString(search['error']) ? { error: search['error'] } : {}),
});

/** Account pages: kept out of search, prerendered as empty forms. */
const head = (title: string) => () => ({
  meta: [
    { title: `${title} · JSON Resume` },
    { name: 'robots', content: 'noindex' },
  ],
});

export const signInRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.signIn,
  validateSearch: Search,
  head: head('Sign in'),
}).lazy(() => import('./auth.lazy').then((m) => m.SignInRoute));

export const signUpRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.signUp,
  validateSearch: Search,
  head: head('Create your account'),
}).lazy(() => import('./auth.lazy').then((m) => m.SignUpRoute));

export const chooseUsernameRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.chooseUsername,
  head: head('Choose your username'),
}).lazy(() => import('./auth.lazy').then((m) => m.ChooseUsernameRoute));
