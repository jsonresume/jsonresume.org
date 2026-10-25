import { Accounts } from '@repo/accounts';
import { Authentication, CurrentUser } from '@repo/api';
import { Effect, Layer, Redacted } from 'effect';
import { toSessionUser } from './http';

/** The session cookie checked against stored sessions; provides CurrentUser. */
export const AuthenticationLive = Layer.effect(
  Authentication,
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    return Authentication.of({
      session: Effect.fn('Authentication.session')(function* (
        httpEffect,
        { credential }
      ) {
        const user = yield* accounts.session(Redacted.value(credential));
        return yield* Effect.provideService(
          httpEffect,
          CurrentUser,
          toSessionUser(user)
        );
      }),
    });
  })
);
