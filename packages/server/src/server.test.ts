import { Effect, Layer } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { HttpApi, HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Schema } from 'effect';
import { createSiteApp, effectWebHandler } from './index';

const dir = mkdtempSync(join(tmpdir(), 'site-'));
mkdirSync(join(dir, 'schema'));
mkdirSync(join(dir, 'assets'));
writeFileSync(join(dir, 'index.html'), '<h1>home</h1>');
writeFileSync(join(dir, 'schema', 'index.html'), '<h1>schema</h1>');
writeFileSync(join(dir, '404.html'), '<h1>missing</h1>');
writeFileSync(join(dir, 'assets', 'app-abc.js'), 'console.log(1)');

class Ping extends HttpApiGroup.make('ping', { topLevel: true }).add(
  HttpApiEndpoint.get('ping', '/ping', {
    success: Schema.Struct({ pong: Schema.Boolean }),
  })
) {}
class TestApi extends HttpApi.make('test').add(Ping).prefix('/api') {}
const handlers = HttpApiBuilder.group(TestApi, 'ping', (h) =>
  h.handle('ping', () => Effect.succeed({ pong: true }))
);
const api = effectWebHandler(
  HttpApiBuilder.layer(TestApi).pipe(Layer.provide(handlers))
);
afterAll(() => api.dispose());

const app = createSiteApp({
  clientDir: dir,
  mount: [
    { prefix: '/api', fetch: api.handler },
    {
      prefix: '/agent',
      fetch: async () => new Response('agent'),
      when: (request) => request.method !== 'GET',
    },
  ],
  protect: { prefix: '/api', exempt: ['/api/events/'] },
  openPaths: ['/api/ping'],
  redirectHosts: {
    'old.example': (url) => `https://new.example${url.pathname}`,
  },
  dynamic: [
    {
      path: '/:handle{@[^/]+}',
      fetch: async (request) =>
        request.url.endsWith('/@known')
          ? new Response('live', { headers: { 'cache-control': 'no-store' } })
          : undefined,
    },
  ],
});
const get = (path: string) => app.request(path);

describe('createSiteApp', () => {
  it('serves prerendered pages at clean paths', async () => {
    expect(await (await get('/')).text()).toBe('<h1>home</h1>');
    const page = await get('/schema');
    expect(await page.text()).toBe('<h1>schema</h1>');
    expect(page.headers.get('cache-control')).toBe(
      'public, max-age=0, must-revalidate'
    );
  });

  it('redirects trailing slashes, keeping the query', async () => {
    const res = await get('/schema/?a=1');
    expect(res.status).toBe(308);
    expect(res.headers.get('location')).toBe('/schema?a=1');
  });

  it('caches fingerprinted assets forever', async () => {
    const res = await get('/assets/app-abc.js');
    expect(res.headers.get('cache-control')).toBe(
      'public, max-age=31536000, immutable'
    );
  });

  it('answers unknown paths with the 404 page', async () => {
    const res = await get('/nope');
    expect(res.status).toBe(404);
    expect(await res.text()).toBe('<h1>missing</h1>');
  });

  it('routes /api to the Effect API', async () => {
    const res = await get('/api/ping');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ pong: true });
    // API responses decide their own caching; the static cache rules stay out.
    expect(res.headers.get('cache-control')).toBeNull();
  });

  it('answers live pages, or passes them on to the 404', async () => {
    const res = await get('/@known');
    expect(await res.text()).toBe('live');
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect((await get('/@unknown')).status).toBe(404);
    expect((await get('/@known/')).headers.get('location')).toBe('/@known');
  });

  it('refuses cross-site writes to the API, but not beacons', async () => {
    const post = (path: string, origin?: string) =>
      app.request(path, {
        method: 'POST',
        headers: { host: 'jsonresume.org', ...(origin ? { origin } : {}) },
      });
    expect((await post('/api/ping', 'https://evil.example')).status).toBe(403);
    expect((await post('/api/ping')).status).toBe(403);
    expect((await post('/api/ping', 'https://jsonresume.org')).status).not.toBe(
      403
    );
    expect(
      (await post('/api/events/view', 'https://evil.example')).status
    ).not.toBe(403);
  });

  it('lets any website call open paths, and only those', async () => {
    const preflight = await app.request('/api/ping', {
      method: 'OPTIONS',
      headers: {
        origin: 'https://inspector.example',
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'authorization',
      },
    });
    expect(preflight.headers.get('access-control-allow-origin')).toBe('*');
    expect(preflight.headers.get('access-control-allow-headers')).toContain(
      'authorization'
    );
    const closed = await app.request('/', {
      headers: { origin: 'https://inspector.example' },
    });
    expect(closed.headers.get('access-control-allow-origin')).toBe(null);
  });

  it('mounts a handler for only the requests it accepts', async () => {
    expect(await (await app.request('/agent', { method: 'POST' })).text()).toBe(
      'agent'
    );
    expect((await app.request('/agent')).status).toBe(404);
  });

  it('redirects every URL of an old host', async () => {
    const res = await app.request('/thomasdavis', {
      headers: { host: 'old.example' },
    });
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://new.example/thomasdavis');
    const post = await app.request('/api/v1/jobs', {
      method: 'POST',
      headers: { host: 'old.example' },
    });
    expect(post.status).toBe(308);
  });
});
