import { ApiKeys, MAX_KEYS, type ApiKeyRecord } from '@repo/accounts';
import {
  ApiKeyAuthentication,
  CurrentUser,
  JsonResumeApi,
  TooManyKeys,
  V1Unauthorized,
} from '@repo/api';
import { Effect, Layer, Redacted } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { toSessionUser } from './http';

const toApiKey = (k: ApiKeyRecord) => ({
  id: k.id,
  name: k.name,
  prefix: k.prefix,
  createdAt: k.createdAt.toISOString(),
  lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
});

/** The signed-in user's API keys: list, create (shown once), revoke. */
export const KeysHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'keys',
  (handlers) =>
    Effect.gen(function* () {
      const keys = yield* ApiKeys;
      return handlers.handleAll({
        list: () =>
          Effect.flatMap(CurrentUser, (u) => keys.list(u.id)).pipe(
            Effect.map((list) => list.map(toApiKey))
          ),
        create: ({ payload }) =>
          Effect.gen(function* () {
            const made = yield* keys.create(
              (yield* CurrentUser).id,
              payload.name
            );
            if (!made) return yield* new TooManyKeys({ max: MAX_KEYS });
            return { key: made.key, apiKey: toApiKey(made.record) };
          }),
        revoke: ({ params }) =>
          Effect.flatMap(CurrentUser, (u) => keys.revoke(u.id, params.id)),
      });
    })
);

/** A Bearer API key, for /api/v1; provides CurrentUser like a session. */
export const ApiKeyAuthenticationLive = Layer.effect(
  ApiKeyAuthentication,
  Effect.gen(function* () {
    const keys = yield* ApiKeys;
    return ApiKeyAuthentication.of({
      bearer: Effect.fn('ApiKeyAuthentication.bearer')(function* (
        httpEffect,
        { credential }
      ) {
        const user = yield* keys.authenticate(Redacted.value(credential));
        if (!user) {
          return yield* new V1Unauthorized({
            error:
              'Invalid API key. Create one at https://jsonresume.org/dashboard/settings',
          });
        }
        return yield* Effect.provideService(
          httpEffect,
          CurrentUser,
          toSessionUser(user)
        );
      }),
    });
  })
);
