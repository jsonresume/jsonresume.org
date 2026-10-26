import { Effect, Semaphore } from 'effect';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { download, ImageFailed } from './download';
import { parseProxyPath, type ImageWidth } from './url';

export interface ImageProxyOptions {
  /** Where resized images are kept (systemd's CacheDirectory on the box). */
  cacheDir: string;
  /** Downloads and resizes at once; more wait their turn. */
  concurrency?: number;
}

const SERVED = {
  'content-type': 'image/webp',
  // A week at the edge and in browsers; avatars rarely change.
  'cache-control': 'public, max-age=604800, stale-while-revalidate=604800',
  'x-content-type-options': 'nosniff',
};
/** A missing image is tried again after an hour. */
const MISSING_TTL_MS = 60 * 60 * 1000;

const resize = (input: Buffer, width: ImageWidth) =>
  Effect.tryPromise({
    try: () =>
      sharp(input, { limitInputPixels: 40_000_000, animated: false })
        .rotate()
        .resize(width, width, { fit: 'cover' })
        .webp({ quality: 72 })
        .toBuffer(),
    catch: (e) => new ImageFailed({ reason: String(e) }),
  });

/**
 * Serves /_img/<width>/<source>.webp (see proxiedImage): another site's
 * image, downloaded from the public web only, resized, and kept on disk.
 * Anything that isn't an image answers 404, and the page shows initials.
 */
export function createImageProxy({
  cacheDir,
  concurrency = 6,
}: ImageProxyOptions) {
  const ready = mkdir(cacheDir, { recursive: true });
  const inFlight = new Map<string, Promise<Buffer | undefined>>();
  const missing = new Map<string, number>();
  const permits = Semaphore.makeUnsafe(concurrency);

  const make = (src: string, width: ImageWidth, file: string) =>
    download(src).pipe(
      Effect.flatMap((input) => resize(input, width)),
      Effect.timeout('15 seconds'),
      Semaphore.withPermit(permits),
      // A full disk costs the cache, not the image.
      Effect.tap((webp) =>
        Effect.tryPromise(async () => {
          await ready;
          const temp = `${file}.${process.pid}.tmp`;
          await writeFile(temp, webp);
          await rename(temp, file);
        }).pipe(Effect.ignore)
      ),
      Effect.catch((error) =>
        Effect.as(
          Effect.logDebug('image proxy miss', { src, error: String(error) }),
          undefined
        )
      )
    );

  const image = (src: string, width: ImageWidth) => {
    const key = createHash('sha256').update(`${width} ${src}`).digest('hex');
    const file = join(cacheDir, `${key}.webp`);
    const pending = inFlight.get(key);
    if (pending) return pending;
    if ((missing.get(key) ?? 0) > Date.now()) return undefined;
    const job = readFile(file)
      .catch(() => Effect.runPromise(make(src, width, file)))
      .then((webp) => {
        if (!webp) {
          if (missing.size > 10_000) missing.clear();
          missing.set(key, Date.now() + MISSING_TTL_MS);
        }
        return webp;
      })
      .finally(() => inFlight.delete(key));
    inFlight.set(key, job);
    return job;
  };

  return async (request: Request): Promise<Response> => {
    const asked = parseProxyPath(new URL(request.url).pathname);
    const result = asked && (await image(asked.src, asked.width));
    if (!result) {
      return new Response(null, {
        status: 404,
        headers: { 'cache-control': 'public, max-age=3600' },
      });
    }
    return new Response(new Uint8Array(result), { headers: SERVED });
  };
}
