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
const TokenSearch = (search: Record<string, unknown>) =>
  Predicate.isString(search['token']) ? { token: search['token'] } : {};

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

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.forgotPassword,
  head: head('Forgot your password?'),
}).lazy(() => import('./auth.lazy').then((m) => m.ForgotPasswordRoute));

export const resetPasswordRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.resetPassword,
  validateSearch: TokenSearch,
  head: head('Choose a new password'),
}).lazy(() => import('./auth.lazy').then((m) => m.ResetPasswordRoute));

const text = (v: unknown) => (Predicate.isString(v) ? v : undefined);
/** The OAuth request, as an MCP client or a registered app sent it. */
const AuthorizeSearch = (search: Record<string, unknown>) => ({
  responseType: text(search['response_type']),
  clientId: text(search['client_id']),
  redirectUri: text(search['redirect_uri']),
  codeChallenge: text(search['code_challenge']),
  codeChallengeMethod: text(search['code_challenge_method']),
  scope: text(search['scope']),
  state: text(search['state']),
});

/** /oauth/authorize: the user lets an app in (an MCP client, an HR tool). */
export const authorizeRoute = createRoute({
  getParentRoute: () => siteRoute,
  path: paths.oauthAuthorize,
  validateSearch: AuthorizeSearch,
  head: head('Connect an app'),
}).lazy(() => import('./auth.lazy').then((m) => m.AuthorizeRoute));
