import { Accounts, GithubOAuth, newToken } from '@repo/accounts';
import { sessionCookie } from '@repo/api';
import { Config, Duration, Effect, Option } from 'effect';
import { HttpRouter, HttpServerResponse } from 'effect/http';
import { OAUTH_COOKIE, PENDING_COOKIE, withSession } from './http';
import { OAUTH_SECONDS, PENDING_SECONDS, sealedCookies } from './pending';

const base = {
  path: '/',
  secure: true,
  sameSite: 'lax',
  httpOnly: true,
} as const;

/** Only paths on this site, so a link can't send people elsewhere after sign-in. */
const safeNext = (next: string | null) =>
  next &&
  next.startsWith('/') &&
  !next.startsWith('//') &&
  !next.startsWith('/\\')
    ? next
    : '/dashboard';

const go = (location: string) =>
  HttpServerResponse.redirect(location, { status: 302 });

/**
 * Sign in with GitHub, outside the HttpApi because it is all redirects:
 * /api/auth/github starts it (intent signin or link), GitHub returns to
 * /api/auth/callback/github, and /api/auth/verify confirms an email link.
 */
export const GithubRoutes = HttpRouter.use((router) =>
  Effect.gen(function* () {
    // Resolved once here, so the routes need nothing per request.
    const oauth = yield* GithubOAuth;
    const accounts = yield* Accounts;
    const { sealOAuth, openOAuth, sealPending } = yield* sealedCookies;
    const site = yield* Config.String('SITE_URL');

    yield* router.add('GET', '/api/auth/github', (request) =>
      Effect.gen(function* () {
        const url = new URL(request.url, site);
        const intent =
          url.searchParams.get('intent') === 'link' ? 'link' : 'signin';
        const state = newToken();
        const sealed = yield* sealOAuth({
          state,
          intent,
          next: safeNext(url.searchParams.get('next')),
        });
        return yield* HttpServerResponse.setCookie(
          go(oauth.authorizeUrl(state, `${site}/api/auth/callback/github`)),
          OAUTH_COOKIE,
          sealed,
          { ...base, maxAge: Duration.seconds(OAUTH_SECONDS) }
        ).pipe(Effect.orDie);
      }).pipe(Effect.orDie)
    );

    yield* router.add('GET', '/api/auth/callback/github', (request) =>
      Effect.gen(function* () {
        const url = new URL(request.url, site);
        const started = yield* openOAuth(request.cookies[OAUTH_COOKIE]);
        const code = url.searchParams.get('code');
        if (
          Option.isNone(started) ||
          !code ||
          url.searchParams.get('state') !== started.value.state
        ) {
          return go('/signin?error=github-expired');
        }
        const { intent, next } = started.value;
        const identity = yield* oauth.identify(
          code,
          `${site}/api/auth/callback/github`
        );

        if (intent === 'link') {
          const token = request.cookies[sessionCookie.key];
          const user = token
            ? yield* Effect.option(accounts.session(token))
            : Option.none();
          if (Option.isNone(user))
            return go('/signin?next=/dashboard/settings');
          return yield* accounts.linkGithub(user.value.id, identity).pipe(
            Effect.as(go('/dashboard/settings?github=linked')),
            Effect.catchTag('GithubTaken', () =>
              Effect.succeed(go('/dashboard/settings?github=taken'))
            )
          );
        }

        const result = yield* accounts.githubSignIn(identity);
        if (result._tag === 'SignedIn')
          return yield* withSession(go(next), result.token);
        const pending = yield* sealPending(identity);
        return yield* HttpServerResponse.setCookie(
          go('/signup/username'),
          PENDING_COOKIE,
          pending,
          {
            ...base,
            maxAge: Duration.seconds(PENDING_SECONDS),
          }
        ).pipe(Effect.orDie);
      }).pipe(
        Effect.catchTags({
          GithubOAuthFailed: (e) =>
            Effect.as(
              Effect.logWarning('GitHub sign-in failed', {
                message: e.message,
              }),
              go('/signin?error=github')
            ),
          GithubUnreachable: () =>
            Effect.succeed(go('/signin?error=github-down')),
        }),
        Effect.orDie
      )
    );

    yield* router.add('GET', '/api/auth/verify', (request) =>
      Effect.gen(function* () {
        const url = new URL(request.url, 'http://local');
        const token = url.searchParams.get('token');
        const verified = token ? yield* accounts.verifyEmail(token) : undefined;
        return go(
          verified ? '/dashboard?verified=1' : '/dashboard?verified=expired'
        );
      })
    );
  })
);
