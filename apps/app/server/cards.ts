import { parseHandle, Profiles } from '@repo/profiles';
import { CARD_SIZE, resumeCardHtml } from '@repo/resume-host';
import { ResumePdf } from '@repo/resume-pdf';
import { Effect, type Layer, ManagedRuntime } from 'effect';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** /_card/<username>.png: a resume's link-preview card. */
export const cardPath = '/_card/:file{[a-zA-Z0-9-]+\\.png}';

const PNG = {
  'content-type': 'image/png',
  // A day at the edge and in crawlers; a changed resume gets a new card file.
  'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
  'x-content-type-options': 'nosniff',
};

/** No resume to draw: the site's own card. */
const fallback = () =>
  new Response(null, {
    status: 302,
    headers: { location: '/og.png', 'cache-control': 'public, max-age=600' },
  });

/**
 * Draws a resume's card (@repo/resume-host resumeCardHtml) with Chromium
 * once per distinct card, kept in `cacheDir` by a hash of its HTML, so a
 * crawler's every fetch after the first is a file read.
 */
export function createCardHandler<E>(
  services: Layer.Layer<Profiles | ResumePdf, E>,
  options: { cacheDir: string; memoMap?: Layer.MemoMap }
) {
  const runtime = ManagedRuntime.make(services, options);
  const ready = mkdir(options.cacheDir, { recursive: true });
  const drawing = new Map<string, Promise<Uint8Array | undefined>>();

  const draw = (html: string, file: string) =>
    Effect.gen(function* () {
      const pdf = yield* ResumePdf;
      const png = yield* pdf.snapshot(html, CARD_SIZE);
      yield* Effect.promise(async () => {
        await ready;
        const temp = `${file}.${process.pid}.tmp`;
        await writeFile(temp, png);
        await rename(temp, file);
      }).pipe(Effect.ignore);
      return png;
    });

  const card = (username: string) =>
    Effect.gen(function* () {
      const handle = parseHandle(`@${username}`);
      if (!handle || handle.extension !== 'html') return undefined;
      const profiles = yield* Profiles;
      const found = yield* profiles.resume(handle.username);
      if (found._tag === 'Moved') return { moved: found.username };
      const html = resumeCardHtml(handle.username, found.resume);
      const key = createHash('sha256').update(html).digest('hex');
      const file = join(options.cacheDir, `${key}.png`);
      const cached = yield* Effect.promise(() =>
        readFile(file).catch(() => undefined)
      );
      if (cached) return { png: new Uint8Array(cached) };
      const pending = drawing.get(key);
      if (pending) return { png: yield* Effect.promise(() => pending) };
      const job = runtime
        .runPromise(draw(html, file))
        .catch(() => undefined)
        .finally(() => drawing.delete(key));
      drawing.set(key, job);
      return { png: yield* Effect.promise(() => job) };
    }).pipe(Effect.orElseSucceed(() => undefined));

  const fetch = async (request: Request): Promise<Response> => {
    const name = new URL(request.url).pathname
      .replace(/^\/_card\//, '')
      .replace(/\.png$/, '');
    const result = await runtime.runPromise(card(name));
    if (result && 'moved' in result)
      return Response.redirect(
        new URL(`/_card/${result.moved}.png`, request.url),
        301
      );
    if (!result?.png) return fallback();
    return new Response(new Uint8Array(result.png), { headers: PNG });
  };

  return { fetch, dispose: () => runtime.dispose() };
}
