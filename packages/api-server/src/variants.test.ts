import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

describe('/api/resume/variants', () => {
  it('copies the resume into a named variant, saves and deletes it', async () => {
    server = testServer();
    await server.post('/api/auth/signup', {
      email: 'ada@example.com',
      password: 'correct horse battery',
      username: 'ada',
    });
    expect(
      (await server.post('/api/resume/variants', { name: 'Acme' })).status
    ).toBe(409);
    await server.fetch('/api/account/resume', {
      method: 'PUT',
      body: JSON.stringify({ resume: { basics: { name: 'Ada' } } }),
    });
    const made = await (
      await server.post('/api/resume/variants', { name: 'Acme ATS', jobId: 7 })
    ).json();
    expect(made).toMatchObject({
      slug: 'acme-ats',
      jobId: 7,
      path: '/@ada/acme-ats',
      resume: { basics: { name: 'Ada' } },
    });
    const put = await server.fetch('/api/resume/variants/acme-ats', {
      method: 'PUT',
      body: JSON.stringify({ resume: { basics: { name: 'Ada for Acme' } } }),
    });
    expect((await put.json()).resume).toEqual({
      basics: { name: 'Ada for Acme' },
    });
    const list = await (await server.fetch('/api/resume/variants')).json();
    expect(list.map((v: { slug: string }) => v.slug)).toEqual(['acme-ats']);
    const editor = await (await server.fetch('/api/editor/resume')).json();
    expect(editor.resume).toEqual({ basics: { name: 'Ada' } });
    expect(
      (
        await server.fetch('/api/resume/variants/acme-ats', {
          method: 'DELETE',
        })
      ).status
    ).toBeLessThan(300);
    expect((await server.fetch('/api/resume/variants/acme-ats')).status).toBe(
      404
    );
  });
});
