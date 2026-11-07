import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

describe('an app’s webhook', () => {
  it('is set by its owner, to https, with a secret that stays', async () => {
    server = testServer();
    await server.post('/api/auth/signup', {
      email: 'ada@example.com',
      password: 'correct horse battery',
      username: 'ada',
    });
    const { app } = await (
      await server.post('/api/oauth/apps', {
        name: 'Acme ATS',
        redirectUris: ['https://ats.example/cb'],
      })
    ).json();
    const put = (url: string | null) =>
      server.fetch(`/api/oauth/apps/${app.id}/webhook`, {
        method: 'PUT',
        body: JSON.stringify({ url }),
      });
    expect(
      await (await server.fetch(`/api/oauth/apps/${app.id}/webhook`)).json()
    ).toBeNull();
    expect((await put('http://ats.example/hook')).status).toBe(400);
    const first = await (await put('https://ats.example/hook')).json();
    expect(first).toMatchObject({ url: 'https://ats.example/hook' });
    expect(first.secret).toMatch(/^whsec_/);
    const moved = await (await put('https://ats.example/v2/hook')).json();
    expect(moved).toEqual({
      url: 'https://ats.example/v2/hook',
      secret: first.secret,
    });
    expect(await (await put(null)).json()).toBeNull();
    expect(
      (
        await server.fetch('/api/oauth/apps/jrc_not_mine/webhook', {
          method: 'PUT',
          body: JSON.stringify({ url: 'https://x.example' }),
        })
      ).status
    ).toBe(400);
  });
});
