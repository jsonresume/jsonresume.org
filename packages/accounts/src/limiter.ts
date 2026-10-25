import { TooManyAttempts } from '@repo/api';
import { Clock, Context, Effect, Layer } from 'effect';

/**
 * Counts attempts per key (an address plus an action) in a sliding window,
 * in memory: enough for one server, and it forgets on restart.
 */
export class RateLimiter extends Context.Service<
  RateLimiter,
  {
    hit(
      key: string,
      limit: number,
      windowSeconds: number
    ): Effect.Effect<void, TooManyAttempts>;
  }
>()('@repo/accounts/RateLimiter') {
  static readonly layer = Layer.sync(RateLimiter, () => {
    const hits = new Map<string, number[]>();
    return RateLimiter.of({
      hit: (key, limit, windowSeconds) =>
        Effect.gen(function* () {
          const now = yield* Clock.currentTimeMillis;
          const since = now - windowSeconds * 1000;
          const recent = (hits.get(key) ?? []).filter((t) => t > since);
          if (recent.length >= limit) {
            const oldest = recent[0] ?? now;
            return yield* new TooManyAttempts({
              retryAfterSeconds: Math.ceil(
                (oldest + windowSeconds * 1000 - now) / 1000
              ),
            });
          }
          recent.push(now);
          hits.set(key, recent);
          if (hits.size > 10_000) hits.clear();
        }),
    });
  });
}
