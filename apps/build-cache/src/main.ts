/**
 * The build cache server. Runs as jsonresume@build-cache behind Caddy at
 * https://jsonresume.org/_turbo.
 * CI points turbo at it with TURBO_API, TURBO_TEAM and TURBO_TOKEN.
 */
import { serve } from '@hono/node-server';
import { NodeRuntime } from '@effect/platform-node';
import { Config, Effect, Redacted, Schedule } from 'effect';
import { createCacheApp } from './cacheApp.ts';
import { makeStore } from './store.ts';

const DAY_MS = 24 * 60 * 60 * 1000;

const main = Effect.gen(function* () {
  const port = yield* Config.Port('PORT').pipe(Config.withDefault(3011));
  const token = yield* Config.Redacted('TURBO_TOKEN');
  // systemd's CacheDirectory (/var/cache/jsonresume/build-cache).
  const dir = yield* Config.String('CACHE_DIRECTORY');
  const maxGb = yield* Config.Number('BUILD_CACHE_MAX_GB').pipe(
    Config.withDefault(10)
  );

  const store = makeStore(dir);
  const app = createCacheApp({ store, token: Redacted.value(token) });

  yield* Effect.acquireRelease(
    Effect.sync(() => serve({ fetch: app.fetch, port, hostname: '127.0.0.1' })),
    (server) => Effect.sync(() => server.close())
  );
  yield* Effect.logInfo('build cache listening', { port, dir });

  // Hourly: drop what no run has used in two weeks, and keep under the cap.
  yield* store
    .sweep({ maxAgeMs: 14 * DAY_MS, maxBytes: maxGb * 1024 ** 3 })
    .pipe(
      Effect.tap((result) => Effect.logInfo('build cache swept', result)),
      Effect.catch((error) =>
        Effect.logWarning('build cache sweep failed', { error: String(error) })
      ),
      Effect.repeat(Schedule.spaced('1 hour'))
    );
});

NodeRuntime.runMain(Effect.scoped(main));
