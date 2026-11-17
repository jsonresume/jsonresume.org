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
  await server.fetch('/api/account/resume', {
    method: 'PUT',
    body: JSON.stringify({
      resume: {
        basics: { name: 'Ada', label: 'Senior TypeScript engineer' },
        skills: [{ name: 'Web', keywords: ['TypeScript', 'React'] }],
      },
    }),
  });
};

describe('job decisions over the API', () => {
  it('needs a session', async () => {
    server = testServer();
    expect((await server.fetch('/api/me/job-decisions')).status).toBe(401);
    expect((await server.fetch('/api/me/job-preferences')).status).toBe(401);
  });

  it('decides, keeps preferences, and tracks both', async () => {
    await signedUp();
    const first = await (
      await server.fetch('/api/me/job-decisions?wait=0')
    ).json();
    expect(first).toMatchObject({ jobs: [], stated: false, suggestions: [] });
    expect(first.preferences.workplaces).toEqual([]);

    const saved = await server.fetch(
      '/api/me/job-preferences?source=interview',
      {
        method: 'PUT',
        body: JSON.stringify({
          workplaces: ['remote_global'],
          payFloor: 150000,
        }),
      }
    );
    expect(await saved.json()).toMatchObject({
      workplaces: ['remote_global'],
      payFloor: 150000,
      avoidSectors: [],
    });
    expect(
      await (await server.fetch('/api/me/job-preferences')).json()
    ).toMatchObject({ payFloor: 150000 });
    expect(
      (await (await server.fetch('/api/me/job-decisions')).json()).stated
    ).toBe(true);

    const events = server.events.map((e) => e.event);
    expect(events).toContain('jobs_decided');
    expect(
      server.events.find((e) => e.event === 'job_preferences_saved')?.properties
    ).toMatchObject({
      source: 'interview',
      workplaces: 'remote_global',
      pay_floor: true,
    });
  });

  it('turns away a preference that is not one', async () => {
    await signedUp();
    const bad = await server.fetch('/api/me/job-preferences', {
      method: 'PUT',
      body: JSON.stringify({ workplaces: ['the moon'] }),
    });
    expect(bad.status).toBe(400);
  });
});
