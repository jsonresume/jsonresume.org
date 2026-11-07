import { RESUME_LINES, textPdf } from '@repo/resume-import/fixtures';
import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

const TEXT = RESUME_LINES.join('\n');

/** POST /api/import with a form, encoded as a browser sends it. */
const send = async (form: FormData) => {
  const encoded = new Request('https://encode.test', {
    method: 'POST',
    body: form,
  });
  return server.fetch('/api/import', {
    method: 'POST',
    body: await encoded.arrayBuffer(),
    headers: { 'content-type': encoded.headers.get('content-type') ?? '' },
  });
};

const upload = (bytes: Uint8Array, name: string, type: string) => {
  const form = new FormData();
  form.set('file', new Blob([new Uint8Array(bytes)], { type }), name);
  return send(form);
};

describe('POST /api/import', () => {
  it('imports pasted text signed out, repairs it, and never saves it', async () => {
    server = testServer();
    const response = await server.post('/api/import', { text: TEXT });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      resume: { basics: { name: 'Ada Lovelace' } },
      confidence: { '/basics/name': 'high' },
      kind: 'text',
      fields: 1,
      cached: false,
      warnings: ['Left out basics › email: Should be an email address.'],
    });
    expect(typeof body.ms).toBe('number');
    // Signed out: a one-off id, and no person made for it.
    expect(server.events.map((e) => e.event)).toEqual([
      'import_started',
      'import_finished',
    ]);
    expect(server.events[1]).toMatchObject({
      id: expect.stringMatching(/^import-/),
      properties: { kind: 'text', fields_found: 1, ok: true },
    });
    // The same text again comes from the cache.
    const again = await (
      await server.post('/api/import', { text: TEXT })
    ).json();
    expect(again.cached).toBe(true);
    expect(server.modelCalls).toHaveLength(1);
  });

  it('takes a file as multipart, and says what is wrong with others', async () => {
    server = testServer();
    const pdf = await upload(
      textPdf(RESUME_LINES),
      'cv.pdf',
      'application/pdf'
    );
    expect(pdf.status).toBe(200);
    expect(await pdf.json()).toMatchObject({
      kind: 'pdf',
      resume: { basics: { name: 'Ada Lovelace' } },
    });
    expect(server.modelCalls[0]).toContain('Computed Bernoulli numbers');

    const png = await upload(
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]),
      'me.png',
      'image/png'
    );
    expect(png.status).toBe(415);
    expect(await png.json()).toMatchObject({ _tag: 'UnsupportedImport' });

    const scan = await upload(textPdf([]), 'scan.pdf', 'application/pdf');
    expect(scan.status).toBe(422);
    expect((await scan.json()).message).toContain('scan');

    const huge = await upload(
      new Uint8Array(5 * 1024 * 1024 + 10),
      'big.pdf',
      'application/pdf'
    );
    expect(huge.status).toBe(413);
    expect(await huge.json()).toMatchObject({ _tag: 'ImportTooLarge' });

    const form = new FormData();
    form.set('other', 'x');
    const empty = await send(form);
    expect(empty.status).toBe(422);

    // Both bodies are documented.
    const spec = await (await server.fetch('/api/openapi.json')).json();
    expect(
      Object.keys(spec.paths['/api/import'].post.requestBody.content).sort()
    ).toEqual(['application/json', 'multipart/form-data']);
  });

  it('limits signed-out callers per address, and signed-in ones more generously', async () => {
    server = testServer();
    const statuses: number[] = [];
    for (let i = 0; i < 11; i++)
      statuses.push((await server.post('/api/import', { text: TEXT })).status);
    expect(statuses.slice(0, 10).every((s) => s === 200)).toBe(true);
    expect(statuses[10]).toBe(429);

    await server.post('/api/auth/signup', {
      email: 'ada@example.com',
      password: 'correct horse battery',
      username: 'ada',
    });
    const mine = await server.post('/api/import', { text: TEXT });
    expect(mine.status).toBe(200);
    expect(server.events.at(-1)).toMatchObject({
      event: 'import_finished',
      properties: { cached: true },
    });
    expect(server.events.at(-1)?.id).not.toMatch(/^import-/);
  });
});
