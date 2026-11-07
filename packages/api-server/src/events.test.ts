import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

describe('product events', () => {
  it('reports what an account does, under its id and without personal details', async () => {
    server = testServer();
    const user = await (
      await server.post('/api/auth/signup', {
        email: 'ada@example.com',
        password: 'correct horse battery',
        username: 'ada',
      })
    ).json();
    const token = /token=([\w-]+)/.exec(server.mail[0]?.text ?? '')?.[1];
    await server.fetch(`/api/auth/verify?token=${token}`);
    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({ resume: { basics: { name: 'Ada' } } }),
    });
    await server.post('/api/account/keys', { name: 'cli' });

    expect(server.events).toEqual([
      {
        id: user.id,
        event: 'user_signed_up',
        properties: { method: 'password' },
      },
      { id: user.id, event: 'email_verified', properties: undefined },
      {
        id: user.id,
        event: 'resume_saved',
        properties: {
          via: 'dashboard',
          source: 'editor',
          real: false,
          first: true,
          sections: 1,
        },
      },
      { id: user.id, event: 'api_key_created', properties: undefined },
    ]);
    expect(JSON.stringify(server.events)).not.toMatch(/ada@example|Ada"/);
  });

  it('counts a first GitHub sign-in as a sign-up, and the next as a sign-in', async () => {
    server = testServer();
    server.identities.set('c1', {
      id: 7,
      login: 'grace',
      avatarUrl: null,
      email: null,
    });
    const viaGithub = async () => {
      const start = await server.fetch('/api/auth/github');
      const state = new URL(
        start.headers.get('location') ?? ''
      ).searchParams.get('state');
      await server.fetch(`/api/auth/callback/github?code=c1&state=${state}`);
    };
    await viaGithub();
    await viaGithub();
    expect(server.events.map((e) => e.event)).toEqual([
      'user_signed_up',
      'user_signed_in',
    ]);
    expect(new Set(server.events.map((e) => e.id)).size).toBe(1);
  });
});
