import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

const ada = {
  email: 'ada@example.com',
  password: 'correct horse battery',
  username: 'ada',
};
const redirect_uri = 'https://ats.example/auth/jsonresume/callback';

const form = (body: Record<string, string>, headers: HeadersInit = {}) => ({
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    ...headers,
  },
  body: new URLSearchParams(body).toString(),
});

/** An HR tool registered by its developer, with a secret. */
const registerApp = async () => {
  await server.post('/api/auth/signup', ada);
  const made = await server.post('/api/oauth/apps', {
    name: 'Acme ATS',
    homepage: 'https://ats.example',
    redirectUris: [redirect_uri],
  });
  expect(made.status).toBe(200);
  const { app, clientSecret } = await made.json();
  expect(clientSecret).toMatch(/^jrs_/);
  return { client_id: app.id as string, secret: clientSecret as string };
};

const approve = async (client_id: string, scope?: string) => {
  const decided = await server.post('/api/oauth/decide', {
    client_id,
    redirect_uri,
    ...(scope && { scope }),
    state: 's1',
    approve: true,
  });
  const url = new URL((await decided.json()).redirect);
  return url.searchParams.get('code') ?? '';
};

describe('OAuth apps people register (Sign in with JSON Resume)', () => {
  it('runs the server-side flow: consent with scopes, secret, userinfo, resume', async () => {
    server = testServer();
    const { client_id, secret } = await registerApp();
    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({
        resume: {
          basics: { name: 'Ada Lovelace', image: 'https://x.test/a.png' },
        },
      }),
    });

    const info = await server.fetch(
      `/api/oauth/client?client_id=${client_id}&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}&scope=${encodeURIComponent('profile email resume:read')}`
    );
    expect(await info.json()).toEqual({
      name: 'Acme ATS',
      redirectHost: 'ats.example',
      homepage: 'https://ats.example',
      owner: 'ada',
      confidential: true,
      scopes: ['profile', 'email', 'resume:read'],
    });
    const unknown = await server.fetch(
      `/api/oauth/client?client_id=${client_id}&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}&scope=payroll`
    );
    expect((await unknown.json()).error).toBe('invalid_scope');

    // A confidential client may skip PKCE, but must send its secret.
    const code = await approve(client_id, 'profile email resume:read');
    const exchange = { grant_type: 'authorization_code', code, redirect_uri };
    const noSecret = await server.fetch(
      '/api/oauth/token',
      form({ ...exchange, client_id })
    );
    expect((await noSecret.json()).error).toBe('invalid_client');
    const basic = `Basic ${Buffer.from(`${client_id}:${secret}`).toString(
      'base64'
    )}`;
    const code2 = await approve(client_id, 'profile email resume:read');
    const tokens = await (
      await server.fetch(
        '/api/oauth/token',
        form({ ...exchange, code: code2 }, { authorization: basic })
      )
    ).json();
    expect(tokens.scope).toBe('profile email resume:read');

    // The app calls with its token alone, not the user's cookies.
    server.jar.clear();
    const bearer = { authorization: `Bearer ${tokens.access_token}` };
    const me = await (
      await server.fetch('/api/oauth/userinfo', { headers: bearer })
    ).json();
    expect(me).toMatchObject({
      preferred_username: 'ada',
      name: 'Ada Lovelace',
      picture: 'https://x.test/a.png',
      profile: 'https://jsonresume.test/@ada',
      email: 'ada@example.com',
      email_verified: false,
    });
    expect(me.sub).toMatch(/^[0-9a-f-]{36}$/);
    const resume = await (
      await server.fetch('/api/oauth/resume', { headers: bearer })
    ).json();
    expect(resume.resume.basics.name).toBe('Ada Lovelace');

    // resume:write wasn't granted.
    const write = await server.fetch('/api/oauth/resume', {
      method: 'PUT',
      headers: bearer,
      body: JSON.stringify({ basics: { name: 'Mallory' } }),
    });
    expect(write.status).toBe(403);
    expect((await write.json()).error).toBe('insufficient_scope');

    // Revoked, the token stops working.
    await server.fetch(
      '/api/oauth/revoke',
      form({ token: tokens.access_token, client_id, client_secret: secret })
    );
    expect(
      (await server.fetch('/api/oauth/userinfo', { headers: bearer })).status
    ).toBe(401);
  });

  it('asks only for profile by default, writes with resume:write, and rotates secrets', async () => {
    server = testServer();
    const { client_id, secret } = await registerApp();
    const exchange = (code: string, client_secret: string) =>
      server.fetch(
        '/api/oauth/token',
        form({
          grant_type: 'authorization_code',
          code,
          redirect_uri,
          client_id,
          client_secret,
        })
      );
    const plain = await (
      await exchange(await approve(client_id), secret)
    ).json();
    expect(plain.scope).toBe('profile');
    const me = await (
      await server.fetch('/api/oauth/userinfo', {
        headers: { authorization: `Bearer ${plain.access_token}` },
      })
    ).json();
    expect(me.email).toBeUndefined();

    const writer = await (
      await exchange(await approve(client_id, 'resume:write'), secret)
    ).json();
    const saved = await server.fetch('/api/oauth/resume', {
      method: 'PUT',
      headers: { authorization: `Bearer ${writer.access_token}` },
      body: JSON.stringify({ basics: { name: 'Ada, via Acme' } }),
    });
    expect(await saved.json()).toEqual({
      username: 'ada',
      url: 'https://jsonresume.test/@ada',
    });

    const apps = await (await server.fetch('/api/oauth/apps')).json();
    expect(apps).toMatchObject([{ name: 'Acme ATS', users: 1 }]);
    const rotated = await (
      await server.post(`/api/oauth/apps/${client_id}/secret`, {})
    ).json();
    const stale = await exchange(await approve(client_id), secret);
    expect((await stale.json()).error).toBe('invalid_client');
    const fresh = await exchange(
      await approve(client_id),
      rotated.clientSecret
    );
    expect(fresh.status).toBe(200);

    // Deleting the app disconnects everyone.
    await server.fetch(`/api/oauth/apps/${client_id}`, { method: 'DELETE' });
    expect(await (await server.fetch('/api/oauth/connections')).json()).toEqual(
      []
    );
  });

  it('checks what an app is registered with', async () => {
    server = testServer();
    await server.post('/api/auth/signup', ada);
    const bad = await server.post('/api/oauth/apps', {
      name: 'Sneaky',
      redirectUris: ['http://evil.example/cb'],
    });
    expect((await bad.json()).error).toBe('invalid_redirect_uri');
    const unnamed = await server.post('/api/oauth/apps', {
      name: ' ',
      redirectUris: [redirect_uri],
    });
    expect(unnamed.status).toBe(400);
  });
});
