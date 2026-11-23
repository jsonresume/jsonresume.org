import { Effect } from 'effect';
import { Hono, type Context } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { createHash, timingSafeEqual } from 'node:crypto';
import { isArtifactHash, type ArtifactMeta, type Store } from './store.ts';

/** Cloudflare refuses larger uploads anyway; turbo then just builds. */
export const MAX_ARTIFACT_BYTES = 100 * 1024 * 1024;

const digest = (text: string) => createHash('sha256').update(text).digest();

/** Compares the Bearer token in constant time. */
const authorized = (header: string | undefined, token: string) => {
  const given = header?.match(/^Bearer (.+)$/)?.[1];
  return given !== undefined && timingSafeEqual(digest(given), digest(token));
};

const noStore = { 'cache-control': 'no-store' };

const artifactHeaders = (size: number, meta: ArtifactMeta) => ({
  ...noStore,
  'content-type': 'application/octet-stream',
  'content-length': String(size),
  ...(meta.duration && { 'x-artifact-duration': meta.duration }),
  ...(meta.tag && { 'x-artifact-tag': meta.tag }),
});

const run = <A>(effect: Effect.Effect<A, unknown>) =>
  Effect.runPromise(
    effect.pipe(
      Effect.tapError((error) =>
        Effect.logWarning('build cache store failed', { error: String(error) })
      ),
      Effect.option
    )
  );

/**
 * Turborepo's remote cache API (v8), for CI: one team, one token, artifacts
 * on this box's disk. Turbo treats every failure here as a cache miss.
 */
export function createCacheApp({
  store,
  token,
}: {
  store: Store;
  token: string;
}) {
  const app = new Hono();

  // The deploy script's health check, and nothing else, is open.
  app.get('/', (c) => c.text('ok', 200, noStore));

  app.use('/v8/*', async (c, next) => {
    if (!authorized(c.req.header('authorization'), token))
      return c.json({ error: 'unauthorized' }, 401, noStore);
    return next();
  });

  app.get('/v8/artifacts/status', (c) =>
    c.json({ status: 'enabled' }, 200, noStore)
  );

  // Usage events: turbo sends them, nothing reads them.
  app.post('/v8/artifacts/events', (c) => c.body(null, 200, noStore));

  const fetch = async (c: Context, withBody: boolean) => {
    const hash = c.req.param('hash') ?? '';
    if (!isArtifactHash(hash)) return c.json({ error: 'bad hash' }, 400);
    const found = await run(store.get(hash));
    if (found._tag === 'None' || found.value === undefined)
      return c.json({ error: 'not found' }, 404, noStore);
    const { size, meta, body } = found.value;
    return new Response(withBody ? body() : null, {
      headers: artifactHeaders(size, meta),
    });
  };

  app.on('HEAD', '/v8/artifacts/:hash', (c) => fetch(c, false));
  app.get('/v8/artifacts/:hash', (c) => fetch(c, true));

  app.put(
    '/v8/artifacts/:hash',
    bodyLimit({
      maxSize: MAX_ARTIFACT_BYTES,
      onError: (c) => c.json({ error: 'too large' }, 413, noStore),
    }),
    async (c) => {
      const hash = c.req.param('hash');
      if (!isArtifactHash(hash)) return c.json({ error: 'bad hash' }, 400);
      const bytes = new Uint8Array(await c.req.arrayBuffer());
      const saved = await run(
        store.put(hash, bytes, {
          duration: c.req.header('x-artifact-duration'),
          tag: c.req.header('x-artifact-tag'),
        })
      );
      if (saved._tag === 'None')
        return c.json({ error: 'not saved' }, 500, noStore);
      return c.json({ urls: [`${c.req.path}`] }, 202, noStore);
    }
  );

  return app;
}
