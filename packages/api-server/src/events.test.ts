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
      { id: user.id, event: 'resume_saved', properties: { via: 'dashboard' } },
      { id: user.id, event: 'api_key_created', properties: undefined },
    ]);
    expect(JSON.stringify(server.events)).not.toMatch(/ada@example|Ada"/);
  });
});
