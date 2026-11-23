import { Clock, Duration, Effect } from 'effect';
import type { ProfileNotFound, ResumeError } from './errors';

/**
 * How long GitHub's "not found" is believed. A login GitHub doesn't know
 * (often a deleted or renamed account the old registry linked) is believed
 * for an hour. A user without the gist only briefly: they may be creating
 * it now, and reload to see their page.
 */
export const MISS_TTL = {
  'no-user': Duration.hours(1),
  'no-gist': Duration.minutes(2),
} as const;

/** Most logins remembered; the oldest is forgotten first. */
const MAX_MISSES = 20_000;

type Remembered = ProfileNotFound & { reason: keyof typeof MISS_TTL };
const remembered = (e: ResumeError): e is Remembered =>
  e._tag === 'ProfileNotFound' && Object.hasOwn(MISS_TTL, e.reason);

/**
 * Remembers which gist lookups GitHub answered "not found", so crawlers
 * revisiting missing resumes don't spend GitHub's requests on each visit.
 */
export const makeMisses = () => {
  const misses = new Map<string, { until: number; error: ProfileNotFound }>();

  return <A>(
    key: string,
    lookup: Effect.Effect<A, ResumeError>
  ): Effect.Effect<A, ResumeError> =>
    Effect.gen(function* () {
      const now = yield* Clock.currentTimeMillis;
      const hit = misses.get(key);
      if (hit && hit.until > now) return yield* Effect.fail(hit.error);
      if (hit) misses.delete(key);
      return yield* lookup.pipe(
        Effect.tapError((error) =>
          Effect.sync(() => {
            if (!remembered(error)) return;
            misses.set(key, {
              until: now + Duration.toMillis(MISS_TTL[error.reason]),
              error,
            });
            if (misses.size > MAX_MISSES) {
              const [oldest] = misses.keys();
              if (oldest !== undefined) misses.delete(oldest);
            }
          })
        )
      );
    });
};
