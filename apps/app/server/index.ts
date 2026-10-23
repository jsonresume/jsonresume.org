/**
 * The jsonresume.org server: Hono serves the prerendered site from
 * dist/client and mounts the Effect API at /api. Runs as jsonresume@app
 * behind Caddy; `vite build --ssr server/index.ts` bundles it.
 */
import { serve } from '@hono/node-server';
import { NodeRuntime } from '@effect/platform-node';
import { createSiteApp, effectWebHandler } from '@repo/server';
import { Config, Effect } from 'effect';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiLayer } from './api';

const clientDir = join(dirname(fileURLToPath(import.meta.url)), '../client');

const main = Effect.gen(function* () {
  const port = yield* Config.Port('PORT').pipe(Config.withDefault(3003));
  const hostname = yield* Config.String('HOST').pipe(
    Config.withDefault('127.0.0.1')
  );
  const version = yield* Config.String('GIT_COMMIT_SHA').pipe(
    Config.withDefault('dev')
  );

  const api = yield* Effect.acquireRelease(
    Effect.sync(() => effectWebHandler(apiLayer(version))),
    (handler) => Effect.promise(() => handler.dispose())
  );
  const app = createSiteApp({
    clientDir,
    mount: [{ prefix: '/api', fetch: api.handler }],
  });

  yield* Effect.acquireRelease(
    Effect.sync(() => serve({ fetch: app.fetch, port, hostname })),
    (server) => Effect.sync(() => server.close())
  );
  yield* Effect.logInfo(`listening on http://${hostname}:${port}`, { version });
  return yield* Effect.never;
});

NodeRuntime.runMain(main.pipe(Effect.scoped));
