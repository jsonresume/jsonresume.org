/**
 * The jsonresume.org server: Hono serves the prerendered site from
 * dist/client, resumes at /@username (rendered live, with profiles in
 * Postgres) and the Effect API at /api. Runs as jsonresume@app behind Caddy;
 * `vite build --ssr server/index.ts` bundles it.
 */
import { serve } from '@hono/node-server';
import { NodeRuntime } from '@effect/platform-node';
import { PurgeUnverified, apiRoutes } from '@repo/api-server';
import { PgLive } from '@repo/database';
import { mcpRoutes } from '@repo/mcp';
import { createSiteApp, effectWebHandler } from '@repo/server';
import { Config, Effect, Layer, Option } from 'effect';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { registryRedirect } from '@repo/resume-host';
import {
  discoveryRoutes,
  isMcpRequest,
  openPaths,
  sessionless,
} from './agents';
import { createJobPages, jobPath, jobsPath } from './jobPages';
import { createResumeHandler, resumePath } from './resumes';
import { appServices } from './services';

type ServerEntry = typeof import('../src/entry-server');

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = join(distDir, 'client');

/** The SSR build's renderer, with the client build's assets. */
const loadRenderer = Effect.promise(async () => {
  const entry: ServerEntry = await import(
    pathToFileURL(join(distDir, 'ssr/entry-server.js')).href
  );
  const vite = JSON.parse(
    await readFile(join(clientDir, '.vite/manifest.json'), 'utf8')
  );
  return entry.createAppRenderer(
    entry.routerManifestFromVite(vite, entry.clientEntry)
  );
});

const apiKeysRedirect = () =>
  new Response(null, {
    status: 301,
    headers: { location: '/dashboard/settings#api-keys' },
  });

const main = Effect.gen(function* () {
  const port = yield* Config.Port('PORT').pipe(Config.withDefault(3003));
  const hostname = yield* Config.String('HOST').pipe(
    Config.withDefault('127.0.0.1')
  );
  const version = yield* Config.String('GIT_COMMIT_SHA').pipe(
    Config.withDefault('dev')
  );

  const services = appServices(PgLive);
  const memoMap = Layer.makeMemoMapUnsafe();
  const api = yield* Effect.acquireRelease(
    Effect.sync(() =>
      effectWebHandler(
        Layer.mergeAll(apiRoutes(version), PurgeUnverified).pipe(
          Layer.provide(services)
        ),
        { memoMap }
      )
    ),
    (handler) => Effect.promise(() => handler.dispose())
  );
  const site = yield* Config.String('SITE_URL').pipe(
    Config.withDefault('https://jsonresume.org')
  );
  const openAiChallenge = yield* Config.option(
    Config.String('OPENAI_APPS_CHALLENGE')
  );
  const mcp = yield* Effect.acquireRelease(
    Effect.sync(() =>
      effectWebHandler(mcpRoutes(site).pipe(Layer.provide(services)), {
        memoMap,
      })
    ),
    (handler) => Effect.promise(() => handler.dispose())
  );
  const render = yield* loadRenderer;
  const resumes = yield* Effect.acquireRelease(
    Effect.sync(() =>
      createResumeHandler(
        (request, context) => render(request, context),
        services,
        { memoMap }
      )
    ),
    (handler) => Effect.promise(() => handler.dispose())
  );
  const jobs = yield* Effect.acquireRelease(
    Effect.sync(() =>
      createJobPages((request, context) => render(request, context), services, {
        memoMap,
      })
    ),
    (handler) => Effect.promise(() => handler.dispose())
  );
  const app = createSiteApp({
    clientDir,
    mount: [
      { prefix: '/api', fetch: api.handler },
      { prefix: '/mcp', fetch: mcp.handler, when: isMcpRequest },
    ],
    dynamic: [
      { path: resumePath, fetch: resumes.fetch },
      { path: jobsPath, fetch: jobs.board },
      { path: jobPath, fetch: jobs.job },
      // Where the jobs CLI and its docs send people for a key.
      { path: '/api-keys', fetch: async () => apiKeysRedirect() },
      ...discoveryRoutes(site, Option.getOrUndefined(openAiChallenge)),
    ],
    // Beacons carry no authority; /api/v1 takes API keys, never cookies;
    // OAuth clients register and get tokens without a session.
    protect: {
      prefix: '/api',
      exempt: ['/api/events/', '/api/v1/', ...sessionless],
    },
    openPaths,
    // The registry moved here: its links redirect (see registryRedirect).
    redirectHosts: { 'registry.jsonresume.org': registryRedirect },
  });

  yield* Effect.acquireRelease(
    Effect.sync(() => serve({ fetch: app.fetch, port, hostname })),
    (server) => Effect.sync(() => server.close())
  );
  yield* Effect.logInfo(`listening on http://${hostname}:${port}`, { version });
  return yield* Effect.never;
});

NodeRuntime.runMain(main.pipe(Effect.scoped));
