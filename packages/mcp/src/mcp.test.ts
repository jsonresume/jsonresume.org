import { Accounts, ApiKeys, OAuth, RateLimiter } from '@repo/accounts';
import { accountsStack } from '@repo/accounts/stack';
import { PgAnalyticsStore } from '@repo/analytics/sql';
import { Explore } from '@repo/explore';
import { embedderFrom, JobBoard, JobMatcher } from '@repo/jobs';
import { ProductEvents } from '@repo/posthog';
import { Effect, Layer, ManagedRuntime } from 'effect';
import { HttpRouter, HttpServer, HttpServerResponse } from 'effect/http';
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { prompts, tools } from './catalog';
import { mcpRoutes } from './server';
import { plainCareers } from '@repo/careers/testing';
import { textPdf } from '@repo/resume-import/fixtures';
import {
  emptyReply,
  fakeDownloader,
  fakeReader,
  testImporter,
} from '@repo/resume-import/testing';

let dispose: (() => Promise<void>) | undefined;
afterEach(() => dispose?.());

/** The MCP endpoint over a fresh database, and an API key for a user with a resume. */
const setup = async () => {
  const stack = accountsStack();
  const events: Array<{ event: string; properties?: unknown }> = [];
  const productEvents = Layer.succeed(
    ProductEvents,
    ProductEvents.of({
      capture: (_, event, properties) =>
        Effect.sync(() => void events.push({ event, properties })),
    })
  );
  // Imports: the model "reads" the first line as the name; one PDF online.
  const reader = fakeReader((text) => {
    const reply = emptyReply();
    const name = text.split('\n')[0] ?? null;
    const basics = { ...reply.resume.basics, name };
    return { ...reply, resume: { ...reply.resume, basics } };
  });
  const downloads = fakeDownloader(
    new Map([
      [
        'https://example.com/cv.pdf',
        {
          bytes: textPdf(['Grace Hopper', 'Rear Admiral', 'Navy, 1943 - 1986']),
        },
      ],
    ])
  );
  const services = Layer.mergeAll(
    productEvents,
    RateLimiter.layer,
    downloads,
    ApiKeys.layer,
    OAuth.layer,
    PgAnalyticsStore,
    JobBoard.layer,
    Explore.layer,
    JobMatcher.layer.pipe(
      Layer.provide(embedderFrom(() => new Float32Array(3072).fill(1)))
    )
  ).pipe(Layer.provideMerge(stack.layer));
  const withCareers = Layer.mergeAll(
    services,
    plainCareers.pipe(Layer.provide(services)),
    testImporter(reader.layer).pipe(Layer.provide(services))
  );
  // Another route on the same router, as the API is in the app.
  const neighbour = HttpRouter.add(
    'GET',
    '/neighbour',
    HttpServerResponse.text('open')
  );
  const app = Layer.mergeAll(mcpRoutes(), neighbour).pipe(
    Layer.provide(withCareers),
    Layer.provide(HttpServer.layerServices)
  );
  // One MemoMap, so the endpoint and the setup share one database.
  const memoMap = Layer.makeMemoMapUnsafe();
  const web = HttpRouter.toWebHandler(app, { disableLogger: true, memoMap });
  const runtime = ManagedRuntime.make(withCareers, { memoMap });
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
  return { handler: web.handler, events, ...key };
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

  it('reports which tool was called, and the tool still reads its request', async () => {
    const { handler, key, events } = await setup();
    const { call } = await connect(handler, key);
    expect((await call('get_resume')).value).toMatchObject({
      resume: { basics: { name: 'Ada' } },
    });
    expect(events).toEqual([
      { event: 'mcp_tool_called', properties: { tool: 'get_resume' } },
    ]);
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
      // Only import_resume reaches beyond the account: it downloads a URL.
      expect(t.annotations.openWorldHint, t.name).toBe(
        t.name === 'import_resume'
      );
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
    expect(all.value[0].slug).toBe('elegant');
    expect(all.value[0].inheritedDefaults).toBeGreaterThan(0);
    expect(all.value[0].publicResumes).toBeGreaterThan(
      all.value[1].publicResumes
    );
    // The recommended set is marked, and comes first when asked.
    expect(all.value[0].recommended).toBe(false);
    const marked = all.value.filter(
      (theme: { recommended: boolean }) => theme.recommended
    );
    expect(marked.length).toBeGreaterThanOrEqual(10);
    const recommendedFirst = (
      await call('list_themes', { sort: 'recommended' })
    ).value;
    expect(
      recommendedFirst
        .slice(0, marked.length)
        .every((theme: { recommended: boolean }) => theme.recommended)
    ).toBe(true);
    expect(recommendedFirst[0].slug).toBe('pro');
    const classic = await call('list_themes', {
      style: 'classic',
      sort: 'chosen',
    });
    expect(
      classic.value.every(
        (theme: { style: string }) => theme.style === 'classic'
      )
    ).toBe(true);
    const families = new Set([
      'academic-classic',
      'alta',
      'awesome-professional',
      'deedy',
      'dublin',
      'europass-inspired',
      'harvard-classic',
      'jake-technical',
      'new-york-corporate',
      'stockholm',
    ]);
    const implemented = all.value.filter((theme: { slug: string }) =>
      families.has(theme.slug)
    );
    expect(implemented).toHaveLength(10);
    for (const theme of implemented) {
      expect(
        (await call('set_theme', { slug: theme.slug })).isError
      ).toBeFalsy();
      expect((await call('get_resume')).value.resume.meta.theme).toBe(
        theme.slug
      );
    }
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
      (
        await call('export_resume', {
          format: 'pdf',
          theme: 'pro',
          paper: 'letter',
          fit: true,
        })
      ).value.url
    ).toBe('https://jsonresume.org/@ada.pdf?theme=pro&paper=letter&fit=1');
    expect(
      (await call('export_resume', { format: 'pdf', fit: false })).value.url
    ).toBe('https://jsonresume.org/@ada.pdf');
    expect(
      (await call('export_resume', { format: 'docx', paper: 'letter' })).value
        .url
    ).toBe('https://jsonresume.org/@ada.docx?paper=letter');
    expect(
      (await call('export_resume', { format: 'pdf', theme: 'no-such-theme' }))
        .isError
    ).toBe(true);
    expect(
      (await call('export_resume', { format: 'rendercv' })).value.content
    ).toContain('name: Ada');
    // Word is a file to open, like the PDF; the theme doesn't apply.
    expect(
      (await call('export_resume', { format: 'docx', theme: 'even' })).value
    ).toEqual({ url: 'https://jsonresume.org/@ada.docx', content: null });
    const listed = await call('set_explore_listing', { listed: false });
    expect(listed.value).toEqual({ listed: false });
    expect(
      (await call('search_resumes', { query: 'ada' })).value
    ).toMatchObject({ total: 0, people: [] });
    expect((await call('get_account')).value.links).toMatchObject({
      pdf: 'https://jsonresume.org/@ada.pdf',
      docx: 'https://jsonresume.org/@ada.docx',
      timeline: 'https://jsonresume.org/@ada/timeline',
    });
  });

  it('imports a resume from text or a URL without saving it', async () => {
    const { handler, key, events } = await setup();
    const { call } = await connect(handler, key);
    const fromUrl = await call('import_resume', {
      url: 'https://example.com/cv.pdf',
    });
    expect(fromUrl.isError).toBeFalsy();
    expect(fromUrl.value).toMatchObject({
      kind: 'pdf',
      resume: { basics: { name: 'Grace Hopper' } },
      confidence: { '/basics/name': 'high' },
      cached: false,
    });
    const pasted = await call('import_resume', {
      text: 'Ada Lovelace\nAnalytical Engineer\nLondon, 1842 to 1843',
      url: null,
    });
    expect(pasted.value).toMatchObject({
      kind: 'text',
      resume: { basics: { name: 'Ada Lovelace' } },
    });
    // Nothing saved: the account's resume is as it was.
    expect((await call('get_resume')).value).toMatchObject({
      resume: { basics: { name: 'Ada' } },
    });
    expect(events.map((e) => e.event)).toContain('import_finished');

    const missing = await call('import_resume', {
      url: 'https://example.com/nope.pdf',
    });
    expect(missing.isError).toBe(true);
    const neither = await call('import_resume', {});
    expect(neither).toMatchObject({ isError: true });
    expect(JSON.stringify(neither.value)).toContain('either text or url');
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
