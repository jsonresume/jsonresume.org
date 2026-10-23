import { SESSION_TTL, type UserRecord } from '@repo/accounts';
import { clientFrom } from '@repo/analytics';
import { SessionUser, SIGNED_IN_HINT, sessionCookie } from '@repo/api';
import { Duration, Effect } from 'effect';
import { HttpEffect, HttpServerRequest, HttpServerResponse } from 'effect/http';

const base = { path: '/', secure: true, sameSite: 'lax' } as const;
const maxAge = SESSION_TTL;

/** Pending GitHub sign-ups and OAuth state live in short, signed cookies. */
export const PENDING_COOKIE = 'jr_github_pending';
export const OAUTH_COOKIE = 'jr_oauth';

/** The session (httpOnly) and the readable "signed in" hint, on a response. */
export const withSession = (
  response: HttpServerResponse.HttpServerResponse,
  token: string
) =>
  HttpServerResponse.setCookie(response, sessionCookie.key, token, {
    ...base,
    httpOnly: true,
    maxAge,
  }).pipe(
    Effect.flatMap((r) =>
      HttpServerResponse.setCookie(r, SIGNED_IN_HINT, '1', {
        ...base,
        httpOnly: false,
        maxAge,
      })
    ),
    Effect.orDie
  );

export const withoutSession = (
  response: HttpServerResponse.HttpServerResponse
) =>
  HttpServerResponse.expireCookie(response, sessionCookie.key, base).pipe(
    Effect.flatMap((r) =>
      HttpServerResponse.expireCookie(r, SIGNED_IN_HINT, base)
    ),
    Effect.orDie
  );

/** The same, from inside an HttpApi handler (applied as the response goes out). */
export const setSession = (token: string) =>
  HttpEffect.appendPreResponseHandler((_request, response) =>
    withSession(response, token)
  );
export const clearSession = HttpEffect.appendPreResponseHandler(
  (_request, response) => withoutSession(response)
);

export const setShortCookie = (name: string, value: string, seconds: number) =>
  HttpEffect.appendPreResponseHandler((_request, response) =>
    HttpServerResponse.setCookie(response, name, value, {
      ...base,
      httpOnly: true,
      maxAge: Duration.seconds(seconds),
    }).pipe(Effect.orDie)
  );
export const clearCookie = (name: string) =>
  HttpEffect.appendPreResponseHandler((_request, response) =>
    HttpServerResponse.expireCookie(response, name, base).pipe(Effect.orDie)
  );

export const cookie = (name: string) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    const value: string | undefined = request.cookies[name];
    return value;
  });

/** Who is asking (see clientFrom). */
export const client = Effect.gen(function* () {
  const request = yield* HttpServerRequest.HttpServerRequest;
  return clientFrom((name) => request.headers[name]);
});

export const toSessionUser = (user: UserRecord) =>
  new SessionUser({
    id: user.id,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    github: user.githubLogin
      ? { login: user.githubLogin, avatarUrl: user.avatarUrl }
      : null,
  });
