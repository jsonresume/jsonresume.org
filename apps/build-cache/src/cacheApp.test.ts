import { Effect } from 'effect';
import { mkdtemp, readdir, rm, utimes } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createCacheApp } from './cacheApp.ts';
import { makeStore, type Store } from './store.ts';

const TOKEN = 'test-token';
const HASH = '0123456789abcdef';
const auth = { authorization: `Bearer ${TOKEN}` };

let dir = '';
let store: Store;
let app: ReturnType<typeof createCacheApp>;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'build-cache-'));
  store = makeStore(dir);
  app = createCacheApp({ store, token: TOKEN });
});
afterEach(() => rm(dir, { recursive: true, force: true }));

const put = (hash: string, body: string, headers = {}) =>
  app.request(`/v8/artifacts/${hash}?teamId=jsonresume`, {
    method: 'PUT',
    headers: {
      ...auth,
      'content-type': 'application/octet-stream',
      ...headers,
    },
    body,
  });

describe('build cache', () => {
  it('answers the health check without a token', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
  });

  it('refuses requests without the token', async () => {
    const tries: Record<string, string>[] = [
      {},
      { authorization: 'Bearer wrong' },
    ];
    for (const headers of tries) {
      const res = await app.request(`/v8/artifacts/${HASH}`, { headers });
      expect(res.status).toBe(401);
    }
    expect((await put(HASH, 'x', { authorization: 'nope' })).status).toBe(401);
  });

  it('reports caching as enabled', async () => {
    const res = await app.request('/v8/artifacts/status', { headers: auth });
    expect(await res.json()).toEqual({ status: 'enabled' });
  });

  it('misses an artifact it never stored', async () => {
    const res = await app.request(`/v8/artifacts/${HASH}`, { headers: auth });
    expect(res.status).toBe(404);
  });

  it('gives back what was stored, with its duration and tag', async () => {
    const saved = await put(HASH, 'tarball bytes', {
      'x-artifact-duration': '1234',
      'x-artifact-tag': 'signature',
    });
    expect(saved.status).toBe(202);

    const head = await app.request(`/v8/artifacts/${HASH}`, {
      method: 'HEAD',
      headers: auth,
    });
    expect(head.status).toBe(200);
    expect(head.headers.get('content-length')).toBe('13');

    const res = await app.request(`/v8/artifacts/${HASH}`, { headers: auth });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('tarball bytes');
    expect(res.headers.get('x-artifact-duration')).toBe('1234');
    expect(res.headers.get('x-artifact-tag')).toBe('signature');
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('refuses hashes that could name another file', async () => {
    for (const hash of ['..%2Fetc', 'ABCDEF0123456789', 'short']) {
      const res = await app.request(`/v8/artifacts/${hash}`, { headers: auth });
      expect(res.status).toBe(400);
    }
    expect((await put('not-a-hash', 'x')).status).toBe(400);
  });

  it('refuses artifacts over the limit', async () => {
    const res = await put(HASH, 'x', {
      'content-length': String(200 * 1024 ** 2),
    });
    expect(res.status).toBe(413);
  });
});

describe('sweep', () => {
  const age = async (hash: string, days: number) => {
    const when = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    await utimes(join(dir, hash), when, when);
  };

  it('removes artifacts unused for too long', async () => {
    await put('aaaaaaaaaaaaaaaa', 'old');
    await put('bbbbbbbbbbbbbbbb', 'new');
    await age('aaaaaaaaaaaaaaaa', 20);
    const result = await Effect.runPromise(
      store.sweep({ maxAgeMs: 14 * 24 * 60 * 60 * 1000, maxBytes: 1e9 })
    );
    expect(result.removed).toBe(1);
    expect((await readdir(dir)).sort()).toEqual([
      'bbbbbbbbbbbbbbbb',
      'bbbbbbbbbbbbbbbb.meta',
    ]);
  });

  it('keeps the most recently used under the size cap', async () => {
    await put('aaaaaaaaaaaaaaaa', '12345');
    await put('bbbbbbbbbbbbbbbb', '12345');
    await age('bbbbbbbbbbbbbbbb', 2);
    // Reading the older one makes it the most recently used.
    await app.request('/v8/artifacts/bbbbbbbbbbbbbbbb', { headers: auth });
    const result = await Effect.runPromise(
      store.sweep({ maxAgeMs: 1e12, maxBytes: 7 })
    );
    expect(result).toEqual({ kept: 5, removed: 1 });
    expect(await readdir(dir)).toContain('bbbbbbbbbbbbbbbb');
    expect(await readdir(dir)).not.toContain('aaaaaaaaaaaaaaaa');
  });
});
