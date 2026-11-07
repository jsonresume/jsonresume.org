import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

describe('GET/PUT /api/account/privacy', () => {
  it('keeps chosen contact details, and only those, for the owner to see', async () => {
    server = testServer();
    await server.post('/api/auth/signup', {
      email: 'ada@example.com',
      password: 'correct horse battery',
      username: 'ada',
    });
    const read = async () =>
      (await server.fetch('/api/account/privacy')).json();
    expect(await read()).toEqual({ hidden: [] });
    const set = await server.fetch('/api/account/privacy', {
      method: 'PUT',
      body: JSON.stringify({ hidden: ['phone', 'email', 'phone'] }),
    });
    expect(await set.json()).toEqual({ hidden: ['phone', 'email'] });
    expect(await read()).toEqual({ hidden: ['phone', 'email'] });
    const bad = await server.fetch('/api/account/privacy', {
      method: 'PUT',
      body: JSON.stringify({ hidden: ['salary'] }),
    });
    expect(bad.status).toBe(400);
  });
});
