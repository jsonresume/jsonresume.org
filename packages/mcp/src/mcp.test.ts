import { Accounts, ApiKeys, OAuth } from '@repo/accounts';
import { accountsStack } from '@repo/accounts/stack';
import { PgAnalyticsStore } from '@repo/analytics/sql';
import { embedderFrom, JobBoard, JobMatcher } from '@repo/jobs';
import { Effect, Layer, ManagedRuntime } from 'effect';
import { HttpRouter, HttpServer, HttpServerResponse } from 'effect/http';
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { prompts, tools } from './catalog';
import { mcpRoutes } from './server';

let dispose: (() => Promise<void>) | undefined;
afterEach(() => dispose?.());

/** The MCP endpoint over a fresh database, and an API key for a user with a resume. */
const setup = async () => {
  const stack = accountsStack();
  const services = Layer.mergeAll(
    ApiKeys.layer,
    OAuth.layer,
    PgAnalyticsStore,
    JobBoard.layer,
    JobMatcher.layer.pipe(
      Layer.provide(embedderFrom(() => new Float32Array(3072).fill(1)))
    )
  ).pipe(Layer.provideMerge(stack.layer));
  // Another route on the same router, as the API is in the app.
  const neighbour = HttpRouter.add(
    'GET',
    '/neighbour',
    HttpServerResponse.text('open')
  );
  const app = Layer.mergeAll(mcpRoutes(), neighbour).pipe(
    Layer.provide(services),
    Layer.provide(HttpServer.layerServices)
  );
  // One MemoMap, so the endpoint and the setup share one database.
  const memoMap = Layer.makeMemoMapUnsafe();
  const web = HttpRouter.toWebHandler(app, { disableLogger: true, memoMap });
  const runtime = ManagedRuntime.make(services, { memoMap });
  dispose = async () => {
    await web.dispose();
    await runtime.dispose();
  };
  const key = await runtime.runPromise(
    Effect.gen(function* () {
      const accounts = yield* Accounts;
      const { user } = yield* accounts.signUp({
        email: 'ada@example.com',
        password: 'correct horse battery',
        username: 'ada',
      });
      yield* accounts.saveResume(user.id, {
        basics: { name: 'Ada', label: 'Engineer' },
      });
      const made = yield* (yield* ApiKeys).create(user.id, 'agent');
      // And an OAuth access token, as claude.ai would hold.
      const oauth = yield* OAuth;
      const redirectUri = 'https://claude.ai/api/mcp/auth_callback';
      const client = yield* oauth.register({
        name: 'Claude',
        redirectUris: [redirectUri],
      });
      const verifier = 'verifier-verifier-verifier-verifier-verifier';
      const code = yield* oauth.issueCode({
        clientId: client.id,
        userId: user.id,
        redirectUri,
        codeChallenge: createHash('sha256')
          .update(verifier)
          .digest('base64url'),
      });
      const tokens = yield* oauth.exchangeCode({
        code,
        clientId: client.id,
        redirectUri,
        verifier,
      });
      return { key: made?.key ?? '', access: tokens.access_token };
    })
  );
  return { handler: web.handler, ...key };
};

/** A client speaking Streamable HTTP (2025-06-18) with the key. */
const connect = async (
  handler: (request: Request) => Promise<Response>,
  key: string
) => {
  let session = '';
  let id = 0;
  const send = async (method: string, params?: unknown) => {
    const response = await handler(
      new Request('http://x/mcp', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${key}`,
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
          'mcp-protocol-version': '2025-06-18',
          ...(session && { 'mcp-session-id': session }),
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
      })
    );
    session = response.headers.get('mcp-session-id') ?? session;
    return (await response.json()).result;
  };
  await send('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '1' },
  });
  const call = async (name: string, args: unknown = {}) => {
    const result = await send('tools/call', { name, arguments: args });
    const text = result.content?.[0]?.text ?? '';
    return { isError: result.isError, value: JSON.parse(text || 'null') };
  };
  return { send, call };
};

describe('the MCP server', () => {
  it('refuses requests without a valid token, pointing at OAuth metadata', async () => {
    const { handler } = await setup();
    const response = await handler(
      new Request('http://x/mcp', { method: 'POST', body: '{}' })
    );
    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toContain(
      'oauth-protected-resource'
    );
    // Only /mcp: other routes on the router are not behind it.
    const other = await handler(new Request('http://x/neighbour'));
    expect(await other.text()).toBe('open');
  });

  it('lists every tool and prompt in the catalog, with hints', async () => {
    const { handler, key } = await setup();
    const { send } = await connect(handler, key);
    const listed = await send('tools/list');
    expect(listed.tools.map((t: { name: string }) => t.name).sort()).toEqual(
      tools.map((t) => t.name).sort()
    );
    type Listed = { name: string; annotations: Record<string, unknown> };
    for (const t of listed.tools as Listed[]) {
      expect(typeof t.annotations.readOnlyHint, t.name).toBe('boolean');
      expect(typeof t.annotations.destructiveHint, t.name).toBe('boolean');
      expect(t.annotations.openWorldHint, t.name).toBe(false);
    }
    const hint = (name: string) =>
      (listed.tools as Listed[]).find((t) => t.name === name)?.annotations;
    expect(hint('get_resume')).toMatchObject({
      readOnlyHint: true,
      destructiveHint: false,
    });
    expect(hint('save_resume')).toMatchObject({
      readOnlyHint: false,
      destructiveHint: true,
    });
    expect(hint('mark_job')).toMatchObject({
      readOnlyHint: false,
      destructiveHint: false,
    });
    const listedPrompts = await send('prompts/list');
    expect(
      listedPrompts.prompts.map((p: { name: string }) => p.name).sort()
    ).toEqual(prompts.map((p) => p.name).sort());
  });

  it('reads and edits the resume, themes and account for the key’s user', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    expect((await call('get_resume')).value).toMatchObject({
      resume: { basics: { name: 'Ada' } },
      source: 'stored',
      url: 'https://jsonresume.org/@ada',
    });
    const updated = await call('update_resume_section', {
      section: 'skills',
      value: [{ name: 'TypeScript', keywords: ['Effect'] }],
    });
    expect(updated.value).toEqual({ saved: true, problems: [] });
    expect(
      (await call('validate_resume', { resume: { basics: { email: 7 } } }))
        .value.valid
    ).toBe(false);
    expect(
      (await call('update_resume_section', { section: 'work', value: {} }))
        .isError
    ).toBe(true);
    expect((await call('set_theme', { slug: 'no-such-theme' })).isError).toBe(
      true
    );
    const themes = (await call('list_themes', { query: 'elegant' })).value;
    expect(themes[0].previewUrl).toContain('/@ada?theme=');
    await call('set_theme', { slug: themes[0].slug });
    expect((await call('get_resume')).value.resume).toMatchObject({
      skills: [{ name: 'TypeScript' }],
      meta: { theme: themes[0].slug },
    });
    expect((await call('get_account')).value).toMatchObject({
      username: 'ada',
      links: { json: 'https://jsonresume.org/@ada.json' },
    });
    expect(
      (await call('get_resume_analytics', { range: '7d' })).value.totals.views
    ).toBe(0);
    expect((await call('search_jobs', { query: 'rust' })).value).toEqual({
      total: 0,
      jobs: [],
    });
    expect((await call('match_jobs')).value).toEqual({ total: 0, jobs: [] });
    expect((await call('mark_job', { id: 1, mark: 'applied' })).isError).toBe(
      true
    );
    expect((await call('list_marked_jobs')).value).toEqual([]);
    expect((await call('get_resume_schema')).value.$schema).toContain(
      'json-schema'
    );
  });

  it('takes an OAuth access token as well as an API key', async () => {
    const { handler, access } = await setup();
    const { call } = await connect(handler, access);
    expect((await call('get_account')).value.username).toBe('ada');
    const bad = await handler(
      new Request('http://x/mcp', {
        method: 'POST',
        headers: { authorization: 'Bearer jro_nope' },
        body: '{}',
      })
    );
    expect(bad.status).toBe(401);
  });
});
