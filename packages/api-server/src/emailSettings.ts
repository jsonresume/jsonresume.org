import { Accounts, RateLimiter } from '@repo/accounts';
import { PreferenceStore } from '@repo/jobs';
import { JsonResumeApi } from '@repo/api';
import {
  emailSettings,
  linkUser,
  setEmailSettings,
  stopChange,
} from '@repo/job-digest';
import { Context, Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { client } from './http';

/** Email settings by an email's link (see @repo/job-digest settings.ts). */
export const EmailSettingsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'emailSettings',
  (handlers) =>
    Effect.gen(function* () {
      const limiter = yield* RateLimiter;
      const services = Context.make(Accounts, yield* Accounts).pipe(
        Context.add(PreferenceStore, yield* PreferenceStore)
      );
      /** Tokens are long HMACs, but guessing is still capped per address. */
      const checked = (user: string, token: string) =>
        Effect.gen(function* () {
          const who = yield* client;
          yield* limiter.hit(`email-settings:${who.address}`, 60, 600);
          return yield* linkUser(user, token);
        });
      return handlers.handleAll({
        get: ({ query }) =>
          checked(query.user, query.token).pipe(
            Effect.flatMap(emailSettings),
            Effect.provide(services)
          ),
        set: ({ query, payload }) =>
          checked(query.user, query.token).pipe(
            Effect.flatMap((user) => setEmailSettings(user, payload, 'link')),
            Effect.provide(services)
          ),
        stop: ({ query }) =>
          checked(query.user, query.token).pipe(
            Effect.flatMap((user) =>
              setEmailSettings(
                user,
                stopChange(query.kind ?? 'all'),
                'one-click'
              )
            ),
            Effect.as({ stopped: true }),
            Effect.provide(services),
            Effect.catchTags({
              InvalidLink: () => Effect.succeed({ stopped: false }),
              TooManyAttempts: () => Effect.succeed({ stopped: false }),
            })
          ),
      });
    })
);
