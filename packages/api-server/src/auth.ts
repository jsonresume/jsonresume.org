import { Accounts, RateLimiter } from '@repo/accounts';
import {
  CurrentUser,
  JsonResumeApi,
  NoPendingSignup,
  sessionCookie,
  Unauthorized,
} from '@repo/api';
import { Effect, Option } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import {
  clearCookie,
  clearSession,
  client,
  cookie,
  PENDING_COOKIE,
  setSession,
  toSessionUser,
} from './http';
import { sealedCookies } from './pending';

/** Signing up, in and out; finishing a GitHub sign-up; verification mail. */
export const AuthHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'auth',
  (handlers) =>
    Effect.gen(function* () {
      const accounts = yield* Accounts;
      const limiter = yield* RateLimiter;
      const { openPending } = yield* sealedCookies;
      // Per address: generous for people, tight for scripts.
      const limit = (action: string, count: number, seconds: number) =>
        Effect.flatMap(client, (c) =>
          limiter.hit(`${action}:${c.address}`, count, seconds)
        );

      const pending = Effect.flatMap(cookie(PENDING_COOKIE), openPending).pipe(
        Effect.flatMap(
          Option.match({
            onNone: () => Effect.fail(new NoPendingSignup()),
            onSome: Effect.succeed,
          })
        )
      );

      return handlers.handleAll({
        session: () => CurrentUser,
        signUp: ({ payload }) =>
          Effect.gen(function* () {
            yield* limit('signup', 10, 3600);
            const { user, token } = yield* accounts.signUp(payload);
            yield* setSession(token);
            return toSessionUser(user);
          }),
        signIn: ({ payload }) =>
          Effect.gen(function* () {
            yield* limit('signin', 10, 600);
            const { user, token } = yield* accounts.signIn(payload);
            yield* setSession(token);
            return toSessionUser(user);
          }),
        signOut: () =>
          Effect.gen(function* () {
            const token = yield* cookie(sessionCookie.key);
            if (token) yield* accounts.signOut(token);
            yield* clearSession;
          }),
        checkUsername: ({ query }) =>
          Effect.gen(function* () {
            yield* limit('username', 120, 600).pipe(Effect.orDie);
            const check = yield* accounts.checkUsername(query.name);
            return check.available
              ? { available: true }
              : { available: false, reason: check.reason };
          }),
        pendingGithub: () =>
          Effect.map(pending, (identity) => ({
            login: identity.login,
            avatarUrl: identity.avatarUrl,
          })),
        completeGithub: ({ payload }) =>
          Effect.gen(function* () {
            const identity = yield* pending;
            const { user, token } = yield* accounts.completeGithub(
              identity,
              payload.username
            );
            yield* clearCookie(PENDING_COOKIE);
            yield* setSession(token);
            return toSessionUser(user);
          }),
        forgotPassword: ({ payload }) =>
          Effect.gen(function* () {
            yield* limit('forgot', 5, 3600);
            yield* accounts.requestPasswordReset(payload.email);
          }),
        resetPassword: ({ payload }) =>
          Effect.gen(function* () {
            yield* limit('reset', 10, 3600);
            const { user, token } = yield* accounts.resetPassword(
              payload.token,
              payload.password
            );
            yield* setSession(token);
            return toSessionUser(user);
          }),
        resendVerification: () =>
          Effect.gen(function* () {
            const current = yield* CurrentUser;
            yield* limit('verify', 5, 3600).pipe(
              Effect.mapError(() => new Unauthorized())
            );
            const record = yield* accounts.account(current.id);
            if (record) yield* accounts.resendVerification(record.user);
          }).pipe(Effect.catchTag('Unauthorized', () => Effect.void)),
      });
    })
);
