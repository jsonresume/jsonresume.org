// @vitest-environment node
// The health check against this app's own handlers (API, MCP, discovery,
// the consent page), on an in-memory database, as `pnpm dev` wires them.
import { Accounts, ApiKeys } from '@repo/accounts';
import { apiRoutes } from '@repo/api-server';
import { InMemoryDatabase } from '@repo/database/testing';
import { mcpRoutes } from '@repo/mcp';
import { userActor } from '@repo/resume-versions';
import { checkMcp } from '@repo/mcp/health';
import { effectWebHandler } from '@repo/server';
import { Effect, Layer, ManagedRuntime, Option, Result } from 'effect';
import { FetchHttpClient } from 'effect/http';
import { Hono } from 'hono';
import { afterAll, describe, expect, it } from 'vitest';
import { createAppRenderer } from '../src/entry-server';
import { discoveryRoutes } from './agents';
import { appServices } from './services';

process.env['AUTH_SECRET'] ??= 'test only';
const site = 'http://local.test';
process.env['SITE_URL'] = site;
const services = appServices(InMemoryDatabase);
const memoMap = Layer.makeMemoMapUnsafe();
const api = effectWebHandler(apiRoutes('test').pipe(Layer.provide(services)), {
  memoMap,
});
const mcp = effectWebHandler(mcpRoutes(site).pipe(Layer.provide(services)), {
  memoMap,
});
const runtime = ManagedRuntime.make(services, { memoMap });
const render = createAppRenderer({ routes: {} });

const app = new Hono();
app.all('/api/*', (c) => api.handler(c.req.raw));
app.all('/mcp', (c) => mcp.handler(c.req.raw));
for (const route of discoveryRoutes(site))
  app.get(route.path, () => route.fetch());
app.get('/oauth/authorize', (c) => render(c.req.raw));

afterAll(async () => {
  await api.dispose();
  await mcp.dispose();
  await runtime.dispose();
});

const fetchLocal: typeof fetch = async (input, init) =>
  app.fetch(new Request(input, init));

const check = (token: Option.Option<string>) =>
  Effect.runPromise(
    checkMcp(site, token).pipe(
      Effect.result,
      Effect.provide(FetchHttpClient.layer),
      Effect.provideService(FetchHttpClient.Fetch, fetchLocal)
    )
  );

describe('the MCP health check, against the app', () => {
  it('connects as a client would, and reads the resume', async () => {
    const key = await runtime.runPromise(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const { user } = yield* accounts.signUp({
          email: 'health@example.com',
          password: 'correct horse battery',
          username: 'health',
        });
        yield* accounts.saveResume(
          user.id,
          { basics: { name: 'Health' } },
          userActor
        );
        const made = yield* (yield* ApiKeys).create(user.id, 'health check');
        return made?.key ?? '';
      })
    );
    const result = await check(Option.some(key));
    if (Result.isFailure(result))
      throw new Error(`${result.failure.step}: ${result.failure.message}`);
    const steps = Object.fromEntries(
      result.success.map((s) => [s.step, s.detail])
    );
    expect(Object.keys(steps)).toEqual([
      'challenge',
      'protected-resource',
      'authorization-server',
      'register',
      'authorize-page',
      'initialize',
      'tools/list',
      'get_resume',
    ]);
    expect(steps['register']).toMatch(/^jrc_/);
    expect(steps['get_resume']).toBe('ok');
  }, 60_000);

  it('fails at initialize with a token the server refuses', async () => {
    const result = await check(Option.some('jr_not_a_key'));
    expect(Result.isFailure(result) && result.failure.step).toBe('initialize');
  }, 60_000);
});
