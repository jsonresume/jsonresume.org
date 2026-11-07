import { Effect, Option, Result } from 'effect';
import { FetchHttpClient } from 'effect/http';
import { describe, expect, it } from 'vitest';
import { checkMcp } from './health';

const site = 'https://mcp.test';

type Handler = (request: Request) => Response | undefined;
type Fetch = typeof fetch;

/** A pretend jsonresume.org; `override` replaces one answer to break a step. */
const server =
  (override: Handler = () => undefined): Fetch =>
  async (input, init) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    const replaced = override(request);
    if (replaced) return replaced;
    const json = (body: unknown, status = 200) =>
      Response.json(body, { status });
    if (url.pathname === '/mcp') {
      const auth = request.headers.get('authorization');
      if (auth !== 'Bearer jr_test')
        return new Response('{}', {
          status: 401,
          headers: {
            'www-authenticate': `Bearer resource_metadata="${site}/.well-known/oauth-protected-resource"`,
          },
        });
      const body = (await request.json()) as { id?: number; method: string };
      if (body.id === undefined) return new Response(null, { status: 202 });
      const result =
        body.method === 'initialize'
          ? {
              protocolVersion: '2025-06-18',
              serverInfo: { name: 'jsonresume' },
            }
          : body.method === 'tools/list'
          ? { tools: [{ name: 'get_resume' }, { name: 'save_resume' }] }
          : { content: [{ type: 'text', text: '{}' }] };
      // Answered as an event stream, as servers may.
      return new Response(
        `event: message\ndata: ${JSON.stringify({
          jsonrpc: '2.0',
          id: body.id,
          result,
        })}\n\n`,
        {
          headers: {
            'content-type': 'text/event-stream',
            'mcp-session-id': 's1',
          },
        }
      );
    }
    if (url.pathname === '/.well-known/oauth-protected-resource')
      return json({ resource: `${site}/mcp`, authorization_servers: [site] });
    if (url.pathname === '/.well-known/oauth-authorization-server')
      return json({
        issuer: site,
        authorization_endpoint: `${site}/oauth/authorize`,
        token_endpoint: `${site}/api/oauth/token`,
        registration_endpoint: `${site}/api/oauth/register`,
        code_challenge_methods_supported: ['S256'],
      });
    if (url.pathname === '/api/oauth/register')
      return json({ client_id: 'jrc_new' }, 201);
    if (url.pathname === '/oauth/authorize')
      return url.searchParams.get('client_id') === 'jrc_new'
        ? new Response('<html>consent</html>')
        : new Response('unknown client', { status: 400 });
    return new Response('not found', { status: 404 });
  };

const check = (pretend: Fetch, token?: string) =>
  Effect.runPromise(
    checkMcp(site, Option.fromNullishOr(token)).pipe(
      Effect.result,
      Effect.provide(FetchHttpClient.layer),
      Effect.provideService(FetchHttpClient.Fetch, pretend)
    )
  );

const failedStep = async (override: Handler) => {
  const result = await check(server(override), 'jr_test');
  if (Result.isSuccess(result)) throw new Error('expected a failure');
  return result.failure.step;
};

describe('checkMcp', () => {
  it('goes through discovery, registration, initialize, tools and get_resume', async () => {
    const result = await check(server(), 'jr_test');
    if (Result.isFailure(result)) throw new Error(result.failure.message);
    expect(result.success.map((s) => s.step)).toEqual([
      'challenge',
      'protected-resource',
      'authorization-server',
      'register',
      'authorize-page',
      'initialize',
      'tools/list',
      'get_resume',
    ]);
    expect(result.success.find((s) => s.step === 'tools/list')?.detail).toBe(
      '2 tools'
    );
  });

  it('stops before the signed-in steps without a token', async () => {
    const result = await check(server());
    expect(Result.isSuccess(result) && result.success.at(-1)?.step).toBe(
      'authorize-page'
    );
  });

  it('names the step that broke', async () => {
    const at = (path: string, response: () => Response) => (r: Request) =>
      new URL(r.url).pathname === path ? response() : undefined;
    expect(
      await failedStep(at('/mcp', () => new Response('{}', { status: 200 })))
    ).toBe('challenge');
    expect(
      await failedStep(
        at('/.well-known/oauth-protected-resource', () =>
          Response.json({
            resource: 'https://other/mcp',
            authorization_servers: [site],
          })
        )
      )
    ).toBe('protected-resource');
    expect(
      await failedStep(
        at('/.well-known/oauth-authorization-server', () =>
          Response.json({ issuer: site })
        )
      )
    ).toBe('authorization-server');
    expect(
      await failedStep(
        at('/api/oauth/register', () => new Response('no', { status: 400 }))
      )
    ).toBe('register');
    expect(
      await failedStep(
        at('/oauth/authorize', () => new Response('no', { status: 500 }))
      )
    ).toBe('authorize-page');
    expect(
      await failedStep((r) =>
        new URL(r.url).pathname === '/mcp' && r.headers.has('authorization')
          ? new Response('{"error":"unauthorized"}', { status: 401 })
          : undefined
      )
    ).toBe('initialize');
  });

  it('fails when get_resume is missing or errs', async () => {
    /** The pretend server, answering `method` with `result` (as plain JSON). */
    const answering =
      (method: string, result: unknown): Fetch =>
      async (input, init) => {
        const request = new Request(input, init);
        if (request.headers.has('authorization')) {
          const body = (await request.clone().json()) as {
            id?: number;
            method: string;
          };
          if (body.method === method)
            return Response.json({ jsonrpc: '2.0', id: body.id, result });
        }
        return server()(input, init);
      };
    const noTool = await check(
      answering('tools/list', { tools: [] }),
      'jr_test'
    );
    expect(Result.isFailure(noTool) && noTool.failure).toMatchObject({
      step: 'tools/list',
      message: 'get_resume is missing',
    });
    const errs = await check(
      answering('tools/call', { isError: true, content: [] }),
      'jr_test'
    );
    expect(Result.isFailure(errs) && errs.failure.step).toBe('get_resume');
  });
});
