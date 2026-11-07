import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

describe('/api/resume/proposals', () => {
  it('lists what a proposal changes, and accepts or rejects it', async () => {
    server = testServer();
    const user = await (
      await server.post('/api/auth/signup', {
        email: 'ada@example.com',
        password: 'correct horse battery',
        username: 'ada',
      })
    ).json();
    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({ resume: { basics: { name: 'Ada' } } }),
    });
    for (const label of ['Engineer', 'Poet'])
      await server.sql`
        INSERT INTO app.change_proposals (user_id, actor_kind, actor_id, actor_name, note, resume)
        VALUES (${user.id}, 'assistant', 'jrc_1', 'Claude', 'A headline',
                ${JSON.stringify({ basics: { name: 'Ada', label } })}::json)`;
    const list = await (await server.fetch('/api/resume/proposals')).json();
    expect(list).toHaveLength(2);
    expect(list[0]).toMatchObject({
      by: { kind: 'assistant', name: 'Claude' },
      note: 'A headline',
      changes: [{ path: 'basics.label', kind: 'added' }],
    });
    const [first, second] = list;
    const accepted = await server.post(
      `/api/resume/proposals/${first.id}/accept`,
      {}
    );
    expect(await accepted.json()).toEqual({ version: 2 });
    expect(
      (await server.post(`/api/resume/proposals/${first.id}/accept`, {})).status
    ).toBe(404);
    expect(
      (await server.post(`/api/resume/proposals/${second.id}/reject`, {}))
        .status
    ).toBeLessThan(300);
    expect(await (await server.fetch('/api/resume/proposals')).json()).toEqual(
      []
    );
    // Not an id at all: not found, rather than a database error.
    expect(
      (await server.post('/api/resume/proposals/not-a-uuid/reject', {})).status
    ).toBe(404);
    const history = await (await server.fetch('/api/resume/versions')).json();
    expect(history.versions[0].actor).toEqual({
      kind: 'assistant',
      id: 'jrc_1',
      name: 'Claude',
    });
  });
});
