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
});
