import { Accounts, RateLimiter } from '@repo/accounts';
import { Analytics, AnalyticsStore } from '@repo/analytics';
import { CurrentUser, JsonResumeApi, sessionCookie } from '@repo/api';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { client, cookie } from './http';

/** The dashboard's numbers, for the signed-in user's own resume only. */
export const AnalyticsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'analytics',
  (handlers) =>
    Effect.gen(function* () {
      const store = yield* AnalyticsStore;
      return handlers.handleAll({
        overview: ({ query }) =>
          Effect.flatMap(CurrentUser, (user) =>
            store.overview(user.username, query.range)
          ),
      });
    })
);

/**
 * Beacons from resume pages. Always 204, so they reveal nothing; owners
 * viewing their own page aren't counted; each address is capped.
 */
export const EventsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'events',
  (handlers) =>
    Effect.gen(function* () {
      const analytics = yield* Analytics;
      const accounts = yield* Accounts;
      const limiter = yield* RateLimiter;
      const viewer = Effect.flatMap(cookie(sessionCookie.key), (token) =>
        token
          ? accounts.session(token).pipe(
              Effect.map((u) => u.username),
              Effect.orElseSucceed(() => undefined)
            )
          : Effect.succeed(undefined)
      );
      return handlers.handleAll({
        view: ({ payload }) =>
          Effect.gen(function* () {
            const who = yield* client;
            yield* limiter.hit(`view:${who.address}`, 120, 600);
            if ((yield* viewer) === payload.username.toLowerCase()) return;
            yield* analytics.view(
              {
                id: payload.viewId,
                username: payload.username.toLowerCase(),
                kind: 'page',
                theme: payload.theme,
                referrer: payload.referrer,
                width: payload.width,
              },
              who
            );
          }).pipe(Effect.catchTag('TooManyAttempts', () => Effect.void)),
        ping: ({ payload }) =>
          analytics.ping(payload.viewId, payload.seconds, payload.depth),
      });
    })
);
