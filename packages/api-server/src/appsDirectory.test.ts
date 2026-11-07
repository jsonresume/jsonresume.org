import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

describe('the apps directory', () => {
  it('lists apps their makers list, with a homepage and a line about them', async () => {
    server = testServer();
    await server.post('/api/auth/signup', {
      email: 'ada@example.com',
      password: 'correct horse battery',
      username: 'ada',
    });
    const make = async (name: string, homepage?: string) =>
      (
        await (
          await server.post('/api/oauth/apps', {
            name,
            ...(homepage ? { homepage } : {}),
            redirectUris: ['https://ats.example/cb'],
          })
        ).json()
      ).app.id as string;
    const ats = await make('Acme ATS', 'https://ats.example');
    const bare = await make('No Homepage');
    const list = (id: string, listed: boolean, description: string) =>
      server.fetch(`/api/oauth/apps/${id}/listing`, {
        method: 'PUT',
        body: JSON.stringify({ listed, description }),
      });

    expect((await list(ats, true, '  ')).status).toBe(400);
    expect((await list(bare, true, 'Does things')).status).toBe(400);
    const listed = await list(ats, true, 'Tailors your resume to each job');
    expect(await listed.json()).toMatchObject({
      listed: true,
      description: 'Tailors your resume to each job',
    });

    const directory = await (await server.fetch('/api/apps')).json();
    expect(directory).toEqual([
      {
        id: ats,
        name: 'Acme ATS',
        description: 'Tailors your resume to each job',
        homepage: 'https://ats.example',
        users: 0,
      },
    ]);
    await list(ats, false, 'Tailors your resume to each job');
    expect(await (await server.fetch('/api/apps')).json()).toEqual([]);
  });
});
