import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

const put = (theme: string) =>
  server.fetch('/api/account/theme', {
    method: 'PUT',
    body: JSON.stringify({ theme }),
  });

describe('PUT /api/account/theme', () => {
  it('sets the page’s theme as a new version, and refuses what it can’t', async () => {
    server = testServer();
    await server.post('/api/auth/signup', {
      email: 'ada@example.com',
      password: 'correct horse battery',
      username: 'ada',
    });
    // Nothing to theme yet.
    expect((await put('pro')).status).toBe(409);

    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({
        resume: { basics: { name: 'Ada' }, meta: { version: 'v1' } },
      }),
    });
    expect((await put('no-such-theme')).status).toBe(404);
    const done = await put('pro');
    expect(done.status).toBe(200);

    const editor = await (await server.fetch('/api/editor/resume')).json();
    expect(editor.resume).toEqual({
      basics: { name: 'Ada' },
      meta: { version: 'v1', theme: 'pro' },
    });
    const history = await (await server.fetch('/api/resume/versions')).json();
    expect(history.versions[0]).toMatchObject({
      version: 2,
      actor: { kind: 'user' },
    });
    expect(server.events.map((e) => e.event)).toContain('theme_chosen');
  });
});
