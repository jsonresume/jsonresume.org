import { Accounts, ApiKeys, OAuth } from '@repo/accounts';
import { accountsStack } from '@repo/accounts/stack';
import { PgAnalyticsStore } from '@repo/analytics/sql';
import { Explore } from '@repo/explore';
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
    Explore.layer,
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
      const tokenFor = (scope: string | undefined) =>
        Effect.gen(function* () {
          const code = yield* oauth.issueCode({
            clientId: client.id,
            userId: user.id,
            redirectUri,
            codeChallenge: createHash('sha256')
              .update(verifier)
              .digest('base64url'),
            scope,
          });
          const tokens = yield* oauth.exchangeCode({
            code,
            clientId: client.id,
            secret: undefined,
            redirectUri,
            verifier,
          });
          return tokens.tokens.access_token;
        });
      return {
        key: made?.key ?? '',
        // A self-registered client asking for nothing gets the mcp scope.
        access: yield* tokenFor(undefined),
        // An HR app that may only read the resume.
        readOnly: yield* tokenFor('resume:read'),
      };
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
    // Numbers are plain numbers, without Schema.Number's "Infinity" and "NaN".
    const inputs = listed.tools.map(
      (t: { inputSchema: unknown }) => t.inputSchema
    );
    expect(JSON.stringify(inputs)).not.toContain('Infinity');
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
    // A save that adds schema problems is refused; the resume is kept.
    const broken = await call('save_resume', {
      resume: { basics: { email: 'not-an-email' } },
    });
    expect(broken.isError).toBe(true);
    expect(JSON.stringify(broken.value)).toContain('basics › email');
    expect((await call('get_resume')).value.resume.skills).toHaveLength(1);
    expect(
      (
        await call('update_resume_section', {
          section: 'work',
          value: [{ startDate: 'last year' }],
        })
      ).isError
    ).toBe(true);
    expect((await call('set_theme', { slug: 'no-such-theme' })).isError).toBe(
      true
    );
    // Clients send null for optional parameters, as the schemas allow.
    const all = await call('list_themes', { query: null, tag: null });
    expect(all.isError).toBeFalsy();
    expect(all.value.length).toBeGreaterThan(10);
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

  it('checks the resume for tracking systems and exports it', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    const ats = (await call('check_ats')).value;
    expect(ats.checks).toHaveLength(7);
    expect(ats.checks[0].issues[0]).toMatchObject({
      severity: 'critical',
      field: 'basics.email',
    });
    const other = (
      await call('check_ats', {
        resume: { basics: { name: 'Bo', email: 'bo@example.com' } },
      })
    ).value;
    expect(other.checks[0].issues[0].field).toBe('basics.phone');
    expect((await call('export_resume', { format: 'txt' })).value).toEqual({
      url: 'https://jsonresume.org/@ada.txt',
      content: expect.stringMatching(/^Ada\nEngineer/),
    });
    expect(
      (await call('export_resume', { format: 'pdf', theme: 'even' })).value
    ).toEqual({
      url: 'https://jsonresume.org/@ada.pdf?theme=even',
      content: null,
    });
    expect(
      (await call('export_resume', { format: 'pdf', theme: 'no-such-theme' }))
        .isError
    ).toBe(true);
    expect(
      (await call('export_resume', { format: 'rendercv' })).value.content
    ).toContain('name: Ada');
    const listed = await call('set_explore_listing', { listed: false });
    expect(listed.value).toEqual({ listed: false });
    expect(
      (await call('search_resumes', { query: 'ada' })).value
    ).toMatchObject({ total: 0, people: [] });
    expect((await call('get_account')).value.links).toMatchObject({
      pdf: 'https://jsonresume.org/@ada.pdf',
      timeline: 'https://jsonresume.org/@ada/timeline',
    });
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

  it('lists connected apps and registers OAuth apps of your own', async () => {
    const { handler, key } = await setup();
    const { call } = await connect(handler, key);
    const connected = (await call('list_connected_apps')).value.apps;
    expect(connected).toMatchObject([
      { name: 'Claude', scopes: expect.arrayContaining(['mcp']) },
    ]);
    const bad = await call('create_oauth_app', {
      name: 'Acme ATS',
      redirect_uris: ['http://evil.example/cb'],
    });
    expect(bad.isError).toBe(true);
    const made = (
      await call('create_oauth_app', {
        name: 'Acme ATS',
        homepage: null,
        redirect_uris: ['https://ats.example/cb'],
      })
    ).value;
    expect(made.client_secret).toMatch(/^jrs_/);
    expect((await call('list_oauth_apps')).value.apps).toMatchObject([
      { name: 'Acme ATS', users: 0, homepage: null },
    ]);
    const secret = (
      await call('new_oauth_app_secret', { client_id: made.app.client_id })
    ).value.client_secret;
    expect(secret).not.toBe(made.client_secret);
    await call('delete_oauth_app', { client_id: made.app.client_id });
    expect((await call('list_oauth_apps')).value.apps).toEqual([]);
    // Gone, or never theirs: it says so rather than reporting success.
    expect(
      (await call('delete_oauth_app', { client_id: made.app.client_id }))
        .isError
    ).toBe(true);
    expect(
      (await call('disconnect_app', { client_id: 'jrc_nope' })).isError
    ).toBe(true);
    const { client_id } = connected[0];
    await call('disconnect_app', { client_id });
    expect((await call('list_connected_apps')).value.apps).toEqual([]);
  });

  it('refuses OAuth tokens granted only some scopes, not mcp', async () => {
    const { handler, readOnly } = await setup();
    const response = await handler(
      new Request('http://x/mcp', {
        method: 'POST',
        headers: { authorization: `Bearer ${readOnly}` },
        body: '{}',
      })
    );
    expect(response.status).toBe(401);
  });
});
