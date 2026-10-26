import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

const ada = {
  email: 'ada@example.com',
  password: 'correct horse battery',
  username: 'ada',
};

describe('the API, over HTTP', () => {
  it('signs up with cookies, reads the account, and signs out', async () => {
    server = testServer();
    const signUp = await server.post('/api/auth/signup', ada);
    expect(signUp.status).toBe(200);
    expect(await signUp.json()).toMatchObject({
      username: 'ada',
      emailVerified: false,
    });
    expect(server.jar.get('jr_signed_in')).toBe('1');
    expect(server.jar.has('jr_session')).toBe(true);

    const account = await (await server.fetch('/api/account')).json();
    expect(account).toMatchObject({
      username: 'ada',
      path: '/@ada',
      public: false,
      source: 'stored',
    });

    const token = /token=([\w-]+)/.exec(server.mail[0]?.text ?? '')?.[1];
    const verify = await server.fetch(`/api/auth/verify?token=${token}`);
    expect(verify.headers.get('location')).toBe('/dashboard?verified=1');

    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({ resume: { basics: { name: 'Ada' } } }),
    });
    expect(await (await server.fetch('/api/account')).json()).toMatchObject({
      public: true,
      hasStoredResume: true,
    });

    expect((await server.post('/api/auth/signout', {})).status).toBe(204);
    expect(server.jar.has('jr_session')).toBe(false);
    expect((await server.fetch('/api/account')).status).toBe(401);
  });

  it('explains why a username is unavailable, and refuses a wrong password', async () => {
    server = testServer();
    const check = await (
      await server.fetch('/api/auth/username?name=ghosty')
    ).json();
    expect(check).toEqual({ available: false, reason: 'github' });
    await server.post('/api/auth/signup', ada);
    await server.post('/api/auth/signout', {});
    const wrong = await server.post('/api/auth/signin', {
      email: ada.email,
      password: 'nope nope nope',
    });
    expect(wrong.status).toBe(401);
    expect((await server.post('/api/auth/signin', ada)).status).toBe(200);
  });

  it('counts a view from someone else, not the owner, and shows it on the dashboard', async () => {
    server = testServer();
    await server.post('/api/auth/signup', ada);
    const view = (viewId: string) =>
      server.post('/api/events/view', {
        viewId,
        username: 'ada',
        theme: 'elegant',
        referrer: 'https://www.linkedin.com/feed',
        width: 1280,
      });
    await view('11111111-1111-4111-8111-111111111111'); // the owner, signed in
    const session = server.jar.get('jr_session') ?? '';
    server.jar.delete('jr_session');
    expect((await view('22222222-2222-4222-8222-222222222222')).status).toBe(
      204
    );
    await server.post('/api/events/ping', {
      viewId: '22222222-2222-4222-8222-222222222222',
      seconds: 42,
      depth: 75,
    });
    server.jar.set('jr_session', session);

    const overview = await (
      await server.fetch('/api/analytics/overview?range=7d')
    ).json();
    expect(overview.totals).toMatchObject({
      views: 1,
      medianSeconds: 42,
      readDepth: 75,
    });
    expect(overview.referrers).toEqual([{ label: 'linkedin.com', value: 1 }]);
  });

  it('signs in with GitHub, claiming the ghost, or asks for a name', async () => {
    server = testServer();
    server.identities.set('c1', {
      id: 5,
      login: 'ghosty',
      avatarUrl: null,
      email: null,
    });
    const start = await server.fetch(
      '/api/auth/github?next=/dashboard/settings'
    );
    const state = new URL(start.headers.get('location') ?? '').searchParams.get(
      'state'
    );
    const back = await server.fetch(
      `/api/auth/callback/github?code=c1&state=${state}`
    );
    expect(back.headers.get('location')).toBe('/dashboard/settings');
    expect(
      await (await server.fetch('/api/auth/session')).json()
    ).toMatchObject({ username: 'ghosty', github: { login: 'ghosty' } });

    // A forged state is refused.
    const forged = await server.fetch(
      '/api/auth/callback/github?code=c1&state=nope'
    );
    expect(forged.headers.get('location')).toBe('/signin?error=github-expired');
  });

  it('opens the editor on the saved resume and previews changes in any theme', async () => {
    server = testServer();
    await server.post('/api/auth/signup', ada);
    const empty = await (await server.fetch('/api/editor/resume')).json();
    expect(empty).toEqual({
      resume: null,
      source: 'stored',
      github: null,
      gistWrite: false,
    });

    const resume = { basics: { name: 'Ada Lovelace' } };
    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({ resume }),
    });
    expect(
      (await (await server.fetch('/api/editor/resume')).json()).resume
    ).toEqual(resume);

    const preview = await server.post('/api/editor/preview', {
      resume,
      theme: 'elegant',
    });
    expect(preview.headers.get('content-type')).toContain('text/html');
    expect(await preview.text()).toContain('Ada Lovelace');
    expect(
      await (
        await server.post('/api/editor/preview', { resume, theme: 'nope' })
      ).text()
    ).toContain('No such theme');
    expect(
      await (
        await server.post('/api/editor/preview', {
          resume: [1],
          theme: 'elegant',
        })
      ).text()
    ).toContain('Nothing to preview');
  });

  it('lists verified resumes in Explore, unless their owner opts out', async () => {
    server = testServer();
    await server.post('/api/auth/signup', ada);
    const token = /token=([\w-]+)/.exec(server.mail[0]?.text ?? '')?.[1];
    await server.fetch(`/api/auth/verify?token=${token}`);
    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({
        resume: {
          basics: { name: 'Ada Lovelace', label: 'Analyst' },
          skills: [{ name: 'Maths', keywords: ['Analysis'] }],
        },
      }),
    });
    const found = async (q: string) =>
      (await (await server.fetch(`/api/explore?q=${q}`)).json()).people.map(
        (p: { username: string }) => p.username
      );
    // The index was built before the resume was saved; opting in rebuilds it.
    expect(await (await server.fetch('/api/me/explore')).json()).toEqual({
      listed: true,
    });
    await server.fetch('/api/me/explore', {
      method: 'PUT',
      body: JSON.stringify({ listed: true }),
    });
    expect(await found('analysis')).toEqual(['ada']);
    const off = await server.fetch('/api/me/explore', {
      method: 'PUT',
      body: JSON.stringify({ listed: false }),
    });
    expect(await off.json()).toEqual({ listed: false });
    expect(await found('analysis')).toEqual([]);
    const page = await (await server.fetch('/api/explore?page=x')).json();
    expect(page).toMatchObject({ page: 1, query: '' });
    await server.post('/api/auth/signout', {});
    expect((await server.fetch('/api/me/explore')).status).toBe(401);
    expect((await server.fetch('/api/explore')).status).toBe(200);
  });

  it('serves the job board to anyone, and matches only for a signed-in resume', async () => {
    server = testServer();
    expect(await (await server.fetch('/api/jobs')).json()).toEqual({
      jobs: [],
      thread: null,
    });
    expect((await server.fetch('/api/jobs/123')).status).toBe(404);
    expect((await server.fetch('/api/jobs/status')).status).toBe(200);
    expect((await server.fetch('/api/me/jobs')).status).toBe(401);

    await server.post('/api/auth/signup', ada);
    expect((await server.fetch('/api/me/jobs')).status).toBe(409);
    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({
        resume: { basics: { label: 'Engineer', summary: 'Builds web apps' } },
      }),
    });
    expect(await (await server.fetch('/api/me/jobs')).json()).toEqual([]);
    const mark = await server.fetch('/api/me/jobs/123', {
      method: 'PUT',
      body: JSON.stringify({ mark: 'applied' }),
    });
    expect(mark.status).toBe(404);
  });

  it('issues API keys that open /api/v1, as the jobs CLI calls it', async () => {
    server = testServer();
    await server.post('/api/auth/signup', ada);
    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({
        resume: { basics: { label: 'Engineer', summary: 'Builds web apps' } },
      }),
    });
    const made = await (
      await server.post('/api/account/keys', { name: 'laptop' })
    ).json();
    expect(made.key).toMatch(/^jr_/);
    expect(made.apiKey).toMatchObject({
      name: 'laptop',
      prefix: made.key.slice(0, 10),
    });
    const listed = await (await server.fetch('/api/account/keys')).json();
    expect(listed.map((k: { id: string }) => k.id)).toEqual([made.apiKey.id]);

    server.jar.clear();
    const v1 = (path: string, init: RequestInit = {}, key = made.key) =>
      server.fetch(`/api/v1${path}`, {
        ...init,
        headers: { authorization: `Bearer ${key}` },
      });
    expect(await (await v1('/me')).json()).toMatchObject({
      username: 'ada',
      resume: { basics: { label: 'Engineer' } },
    });
    const refused = await v1('/me', {}, 'jr_wrong');
    expect(refused.status).toBe(401);
    expect((await refused.json()).error).toMatch(/Invalid API key/);
    expect(await (await v1('/jobs?top=5&remote=true')).json()).toEqual({
      jobs: [],
      total: 0,
    });
    const mark = await v1('/jobs/123', {
      method: 'PUT',
      body: JSON.stringify({ state: 'applied' }),
    });
    expect(mark.status).toBe(404);
    expect((await v1('/searches')).status).toBe(200);
    expect(
      (await v1('/jobs/123/dossier', { method: 'PUT', body: '{}' })).status
    ).toBe(501);

    const local = await server.post('/api/v1/jobs', {
      resume: { basics: { label: 'Engineer', summary: 'Builds web apps' } },
    });
    expect(await local.json()).toEqual({ jobs: [], total: 0 });
    expect((await server.post('/api/v1/jobs', { resume: {} })).status).toBe(
      400
    );

    await server.post('/api/auth/signin', {
      email: ada.email,
      password: ada.password,
    });
    await server.fetch(`/api/account/keys/${made.apiKey.id}`, {
      method: 'DELETE',
    });
    expect((await v1('/me')).status).toBe(401);
  });

  it('runs the OAuth flow an MCP client uses: register, consent, code, tokens', async () => {
    server = testServer();
    const registered = await server.post('/api/oauth/register', {
      client_name: 'Claude',
      redirect_uris: ['https://claude.ai/api/mcp/auth_callback'],
    });
    expect(registered.status).toBe(201);
    const { client_id } = await registered.json();
    expect(
      (
        await server.post('/api/oauth/register', {
          redirect_uris: ['http://evil.example/cb'],
        })
      ).status
    ).toBe(400);

    const redirect_uri = 'https://claude.ai/api/mcp/auth_callback';
    const info = await server.fetch(
      `/api/oauth/client?client_id=${client_id}&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}`
    );
    // It registered itself and asked for nothing: the MCP tools.
    expect(await info.json()).toEqual({
      name: 'Claude',
      redirectHost: 'claude.ai',
      homepage: null,
      owner: null,
      confidential: false,
      scopes: ['mcp'],
    });

    const verifier = 'a-long-random-verifier-string-for-pkce-0123456789';
    const { createHash } = await import('node:crypto');
    const code_challenge = createHash('sha256')
      .update(verifier)
      .digest('base64url');
    const decide = (approve: boolean) =>
      server.post('/api/oauth/decide', {
        client_id,
        redirect_uri,
        code_challenge,
        state: 'xyz',
        approve,
      });
    expect((await decide(true)).status).toBe(401);
    await server.post('/api/auth/signup', ada);
    // Without a secret, PKCE is required.
    const noPkce = await server.post('/api/oauth/decide', {
      client_id,
      redirect_uri,
      approve: true,
    });
    expect((await noPkce.json()).error).toBe('invalid_request');
    const denied = new URL((await (await decide(false)).json()).redirect);
    expect(denied.searchParams.get('error')).toBe('access_denied');
    const approved = new URL((await (await decide(true)).json()).redirect);
    expect(approved.searchParams.get('state')).toBe('xyz');
    const code = approved.searchParams.get('code') ?? '';

    const token = (form: Record<string, string>) =>
      server.fetch('/api/oauth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(form).toString(),
      });
    const wrong = await token({
      grant_type: 'authorization_code',
      code,
      client_id,
      redirect_uri,
      code_verifier: 'nope',
    });
    expect((await wrong.json()).error).toBe('invalid_grant');
    // A failed exchange spends the code; get another.
    const code2 =
      new URL((await (await decide(true)).json()).redirect).searchParams.get(
        'code'
      ) ?? '';
    const tokens = await (
      await token({
        grant_type: 'authorization_code',
        code: code2,
        client_id,
        redirect_uri,
        code_verifier: verifier,
      })
    ).json();
    expect(tokens).toMatchObject({
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'mcp',
    });
    expect(tokens.access_token).toMatch(/^jro_/);

    const refreshed = await (
      await token({
        grant_type: 'refresh_token',
        refresh_token: tokens.refresh_token,
        client_id,
      })
    ).json();
    expect(refreshed.access_token).toMatch(/^jro_/);
    const reused = await token({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
      client_id,
    });
    expect(reused.status).toBe(400);

    const connections = await (
      await server.fetch('/api/oauth/connections')
    ).json();
    expect(connections.map((c: { name: string }) => c.name)).toEqual([
      'Claude',
    ]);
    await server.fetch(`/api/oauth/connections/${client_id}`, {
      method: 'DELETE',
    });
    expect(await (await server.fetch('/api/oauth/connections')).json()).toEqual(
      []
    );
  });

  it('streams the Pathways copilot to a signed-in user', async () => {
    server = testServer();
    const ask = () =>
      server.post('/api/pathways/chat', {
        messages: [{ role: 'user', content: 'Where could I go next?' }],
      });
    expect((await ask()).status).toBe(401);
    await server.post('/api/auth/signup', ada);
    const reply = await ask();
    expect(reply.headers.get('content-type')).toContain('text/event-stream');
    const events = (await reply.text())
      .split('\n')
      .filter((line) => line.startsWith('data: '))
      .map((line) => JSON.parse(line.slice(6)));
    expect(events).toEqual([
      { type: 'text', delta: 'Hello @ada' },
      { type: 'done' },
    ]);
  });
});
