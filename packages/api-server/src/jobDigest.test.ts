import { digestToken } from '@repo/job-digest/token';
import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

const subscribed = async () => {
  server = testServer();
  await server.post('/api/auth/signup', {
    email: 'ada@example.com',
    password: 'correct horse battery',
    username: 'ada',
  });
  const saved = await server.fetch('/api/me/job-preferences', {
    method: 'PUT',
    body: JSON.stringify({ weeklyEmail: true }),
  });
  expect((await saved.json()).weeklyEmail).toBe(true);
  const [row] = await server.sql`SELECT id::text AS id FROM app.users`;
  return String(row?.['id']);
};

const weeklyEmail = async () =>
  (await (await server.fetch('/api/me/job-preferences')).json()).weeklyEmail;

describe('stopping the weekly jobs email from its link', () => {
  it('turns it off with the right token only', async () => {
    const id = await subscribed();
    const stop = (token: string) =>
      server.fetch(`/api/job-digest/stop?user=${id}&token=${token}`, {
        method: 'POST',
        // A mail app's one-click unsubscribe (RFC 8058), from no site.
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          origin: 'https://mail.example',
        },
        body: 'List-Unsubscribe=One-Click',
      });

    const wrong = await stop(digestToken('test secret', 'someone-else'));
    expect(await wrong.json()).toEqual({ stopped: false });
    expect(await weeklyEmail()).toBe(true);

    const right = await stop(digestToken('test secret', id));
    expect(right.status).toBe(200);
    expect(await right.json()).toEqual({ stopped: true });
    expect(await weeklyEmail()).toBe(false);
  });
});
