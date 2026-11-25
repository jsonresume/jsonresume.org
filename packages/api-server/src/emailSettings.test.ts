import { emailToken } from '@repo/accounts';
import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

const signedUp = async () => {
  server = testServer();
  await server.post('/api/auth/signup', {
    email: 'ada@example.com',
    password: 'correct horse battery',
    username: 'ada',
  });
  const [row] = await server.sql`SELECT id::text AS id FROM app.users`;
  return String(row?.['id']);
};

const mine = async () =>
  (await server.fetch('/api/account/emails')).json() as Promise<unknown>;

describe('email settings', () => {
  it('starts with account emails on and the weekly email off', async () => {
    await signedUp();
    expect(await mine()).toEqual({ accountEmails: true, weeklyJobs: false });
    const set = await server.fetch('/api/account/emails', {
      method: 'PUT',
      body: JSON.stringify({ weeklyJobs: true }),
    });
    expect(await set.json()).toEqual({ accountEmails: true, weeklyJobs: true });
    const prefs = await server.fetch('/api/me/job-preferences');
    expect((await prefs.json()).weeklyEmail).toBe(true);
  });

  it('reads and changes them from an email’s link, with its token only', async () => {
    const id = await signedUp();
    const link = (token: string) =>
      `/api/email-settings?user=${id}&token=${token}`;
    const wrong = await server.fetch(link(emailToken('test secret', 'x')));
    expect(wrong.status).toBe(400);
    const token = emailToken('test secret', id);
    const read = await server.fetch(link(token));
    expect(await read.json()).toEqual({
      accountEmails: true,
      weeklyJobs: false,
    });
    const off = await server.fetch(link(token), {
      method: 'PUT',
      body: JSON.stringify({ accountEmails: false }),
    });
    expect(await off.json()).toEqual({
      accountEmails: false,
      weeklyJobs: false,
    });
  });

  it('stops in one click from a mail app, from another site', async () => {
    const id = await signedUp();
    await server.fetch('/api/account/emails', {
      method: 'PUT',
      body: JSON.stringify({ weeklyJobs: true }),
    });
    const stop = (token: string, kind: string) =>
      server.fetch(
        `/api/email-settings/stop?user=${id}&token=${token}&kind=${kind}`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            origin: 'https://mail.example',
          },
          body: 'List-Unsubscribe=One-Click',
        }
      );
    const wrong = await stop('nope', 'all');
    expect(await wrong.json()).toEqual({ stopped: false });
    const right = await stop(emailToken('test secret', id), 'account');
    expect(await right.json()).toEqual({ stopped: true });
    expect(await mine()).toEqual({ accountEmails: false, weeklyJobs: true });
  });
});
