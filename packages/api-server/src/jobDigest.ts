import { RateLimiter } from '@repo/accounts';
import { JsonResumeApi } from '@repo/api';
import { stopDigest } from '@repo/job-digest';
import { PreferenceStore } from '@repo/jobs';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { client } from './http';

/** The weekly email's unsubscribe link (see @repo/job-digest). */
export const JobDigestHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'jobDigest',
  (handlers) =>
    Effect.gen(function* () {
      const limiter = yield* RateLimiter;
      const preferences = yield* PreferenceStore;
      return handlers.handleAll({
        stop: ({ query }) =>
          Effect.gen(function* () {
            const who = yield* client;
            yield* limiter.hit(`digest-stop:${who.address}`, 30, 600);
            const stopped = yield* stopDigest(query.user, query.token).pipe(
              Effect.provideService(PreferenceStore, preferences),
              // AUTH_SECRET is always set where the server runs.
              Effect.orDie
            );
            return { stopped };
          }).pipe(
            Effect.catchTag('TooManyAttempts', () =>
              Effect.succeed({ stopped: false })
            )
          ),
      });
    })
);
