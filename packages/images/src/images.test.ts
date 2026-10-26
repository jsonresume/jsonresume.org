import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { createImageProxy } from './proxy';
import { parseProxyPath, proxiedImage } from './url';

const avatar = 'https://avatars.githubusercontent.com/u/416209?v=4&s=460';

describe('proxiedImage', () => {
  it('round-trips a source and width through the path', () => {
    const path = proxiedImage(avatar, 96);
    expect(path).toMatch(/^\/_img\/96\/[\w-]+\.webp$/);
    expect(parseProxyPath(path ?? '')).toEqual({ src: avatar, width: 96 });
  });

  it('keeps unicode in the source', () => {
    const src = 'https://example.org/photos/zoë.jpg';
    expect(parseProxyPath(proxiedImage(src, 64) ?? '')?.src).toBe(src);
  });

  it('leaves our own paths, data: URIs and nothing alone', () => {
    expect(proxiedImage('/img/team/x.png', 96)).toBe('/img/team/x.png');
    expect(proxiedImage('data:image/png;base64,AA', 96)).toBe(
      'data:image/png;base64,AA'
    );
    expect(proxiedImage(null, 96)).toBeNull();
  });

  it('refuses widths it does not make and sources that are not web URLs', () => {
    const path = proxiedImage(avatar, 96) ?? '';
    expect(parseProxyPath(path.replace('/96/', '/97/'))).toBeUndefined();
    const file = btoa('file:///etc/passwd').replace(/=+$/, '');
    expect(parseProxyPath(`/_img/96/${file}.webp`)).toBeUndefined();
    expect(parseProxyPath('/_img/96/a.webp')).toBeUndefined();
  });
});

const get = (proxy: (r: Request) => Promise<Response>, path: string) =>
  proxy(new Request(`https://jsonresume.org${path}`));

describe('createImageProxy', () => {
  it('serves a resized image from its cache', async () => {
    const cacheDir = mkdtempSync(join(tmpdir(), 'images-'));
    const webp = await sharp({
      create: { width: 96, height: 96, channels: 3, background: '#fff18f' },
    })
      .webp()
      .toBuffer();
    const key = createHash('sha256').update(`96 ${avatar}`).digest('hex');
    writeFileSync(join(cacheDir, `${key}.webp`), webp);
    const res = await get(
      createImageProxy({ cacheDir }),
      proxiedImage(avatar, 96) ?? ''
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/webp');
    expect(res.headers.get('cache-control')).toContain('max-age=604800');
    expect(
      (await sharp(Buffer.from(await res.arrayBuffer())).metadata()).width
    ).toBe(96);
  });

  it('never fetches from this machine or its network', async () => {
    let hits = 0;
    const server = createServer((_, res) => {
      hits++;
      res.end();
    });
    await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    const proxy = createImageProxy({
      cacheDir: mkdtempSync(join(tmpdir(), 'images-')),
    });
    for (const src of [
      `http://127.0.0.1:${port}/a.png`,
      `http://localhost:${port}/a.png`,
      `http://127.0.0.1.nip.io:${port}/a.png`,
      'http://169.254.169.254/latest/meta-data/',
    ]) {
      expect((await get(proxy, proxiedImage(src, 64) ?? '')).status).toBe(404);
    }
    server.close();
    expect(hits).toBe(0);
  });

  it('answers 404 for paths it does not understand', async () => {
    const proxy = createImageProxy({
      cacheDir: mkdtempSync(join(tmpdir(), 'images-')),
    });
    expect((await get(proxy, '/_img/96/nope.webp')).status).toBe(404);
  });
});
