import completeResume from '@jsonresume/sample-data/complete-resume.json';
import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

const person = (username: string) => ({
  email: `${username}@example.com`,
  password: 'correct horse battery',
  username,
});
const own = {
  basics: { name: 'Ada Lovelace', label: 'Engineer' },
  work: [{ name: 'Analytical Engines', position: 'Programmer' }],
  skills: [{ name: 'Mathematics' }],
};
const redirect_uri = 'https://ats.example/callback';

const put = (path: string, body: unknown, headers: HeadersInit = {}) =>
  server.fetch(path, { method: 'PUT', body: JSON.stringify(body), headers });
const json = async (path: string) => (await server.fetch(path)).json();

describe('resume versions', () => {
  it('lists, reads, compares and restores the signed-in user’s versions', async () => {
    server = testServer();
    await server.post('/api/auth/signup', person('ada'));
    await put('/api/account/resume', { resume: completeResume });
    await put('/api/account/resume', { resume: own });
    await put('/api/account/resume', { resume: own }); // unchanged: no version

    const page = await json('/api/resume/versions');
    expect(page.next).toBeNull();
    expect(
      page.versions.map((v: { version: number; actor: unknown }) => [
        v.version,
        v.actor,
      ])
    ).toEqual([
      [2, { kind: 'user', id: null, name: null }],
      [1, { kind: 'user', id: null, name: null }],
    ]);
    expect(page.versions[0].changeCount).toBeGreaterThan(5);
    expect(page.versions[0].changes).toHaveLength(5);
    expect(await json('/api/resume/versions?limit=1')).toMatchObject({
      next: 2,
    });

    const first = await json('/api/resume/versions/1');
    expect(first.resume).toEqual(completeResume);
    const diff = await json('/api/resume/versions/diff?to=2');
    expect(diff.from).toBe(1);
    expect(diff.changes).toContainEqual({
      path: 'basics.name',
      kind: 'changed',
    });

    const restored = await server.post('/api/resume/versions/1/restore', {});
    expect(await restored.json()).toEqual({ restored: 1, version: 3 });
    const latest = await json('/api/resume/versions/3');
    expect(latest).toMatchObject({
      actor: { kind: 'restore' },
      note: 'Restored version 1',
    });
    expect(JSON.stringify(latest.resume)).toBe(JSON.stringify(completeResume));
    const missing = await server.fetch('/api/resume/versions/9');
    expect(missing.status).toBe(404);

    // Honest saves: the sample isn't real; the first save is the first.
    const saves = server.events
      .filter((e) => e.event === 'resume_saved')
      .map((e) => e.properties);
    expect(saves[0]).toMatchObject({
      source: 'editor',
      real: false,
      first: true,
    });
    expect(saves[1]).toMatchObject({
      source: 'editor',
      real: true,
      first: false,
    });
    expect(server.events.map((e) => e.event)).toContain('version_restored');
  });

  it('shows each account only its own history, and nothing signed out', async () => {
    server = testServer();
    await server.post('/api/auth/signup', person('ada'));
    await put('/api/account/resume', { resume: own });
    server.jar.clear();
    expect((await server.fetch('/api/resume/versions')).status).toBe(401);
    await server.post('/api/auth/signup', person('bob'));
    expect((await json('/api/resume/versions')).versions).toEqual([]);
    expect((await server.fetch('/api/resume/versions/1')).status).toBe(404);
    const restore = await server.post('/api/resume/versions/1/restore', {});
    expect(restore.status).toBe(404);
  });

  it('names the API key or OAuth app that saved a version', async () => {
    server = testServer();
    await server.post('/api/auth/signup', person('ada'));
    const made = await (
      await server.post('/api/account/keys', { name: 'laptop' })
    ).json();
    const app = await (
      await server.post('/api/oauth/apps', {
        name: 'Acme ATS',
        homepage: 'https://ats.example',
        redirectUris: [redirect_uri],
      })
    ).json();
    const decided = await server.post('/api/oauth/decide', {
      client_id: app.app.id,
      redirect_uri,
      scope: 'resume:write',
      state: 's',
      approve: true,
    });
    const code = new URL((await decided.json()).redirect).searchParams.get(
      'code'
    );
    const basic = Buffer.from(`${app.app.id}:${app.clientSecret}`).toString(
      'base64'
    );
    const tokens = await (
      await server.fetch('/api/oauth/token', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          authorization: `Basic ${basic}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code ?? '',
          redirect_uri,
        }).toString(),
      })
    ).json();

    const cookies = new Map(server.jar);
    server.jar.clear();
    const v1 = await put('/api/v1/resume', own, {
      authorization: `Bearer ${made.key}`,
    });
    expect(v1.status).toBe(200);
    const oauth = await put(
      '/api/oauth/resume',
      { ...own, basics: { name: 'Ada L' } },
      { authorization: `Bearer ${tokens.access_token}` }
    );
    expect(oauth.status).toBe(200);

    for (const [k, v] of cookies) server.jar.set(k, v);
    const page = await json('/api/resume/versions');
    expect(page.versions.map((v: { actor: unknown }) => v.actor)).toEqual([
      { kind: 'app', id: app.app.id, name: 'Acme ATS' },
      { kind: 'app', id: made.apiKey.id, name: 'laptop' },
    ]);
    const sources = server.events
      .filter((e) => e.event === 'resume_saved')
      .map((e) => e.properties);
    expect(sources).toEqual([
      { via: 'api', source: 'api', real: true, first: true, sections: 3 },
      {
        via: 'oauth_app',
        source: 'oauth_app',
        real: true,
        first: false,
        sections: 3,
      },
    ]);
  });
});
