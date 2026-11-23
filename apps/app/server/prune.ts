import { Duration, Effect, Schedule } from 'effect';
import { readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

/** Files written longer ago than this go: anything still wanted is made again. */
export const CACHE_MAX_AGE = Duration.days(30);

/** Removes files in `dir` older than `maxAge`; how many went. */
export const pruneDir = (dir: string, maxAge: Duration.Duration, now: number) =>
  Effect.promise(async () => {
    const cutoff = now - Duration.toMillis(maxAge);
    const names = await readdir(dir).catch(() => [] as string[]);
    let removed = 0;
    for (const name of names) {
      const file = join(dir, name);
      const info = await stat(file).catch(() => undefined);
      if (info?.isFile() && info.mtimeMs < cutoff) {
        await rm(file, { force: true });
        removed += 1;
      }
    }
    return removed;
  });

/**
 * Daily, and once at startup: drop old files from the server's disk caches
 * (resized images, link-preview cards), so they stay the size of what is
 * in use rather than everything ever drawn.
 */
export const pruneCaches = (dirs: ReadonlyArray<string>) =>
  Effect.gen(function* () {
    const now = Date.now();
    for (const dir of dirs) {
      const removed = yield* pruneDir(dir, CACHE_MAX_AGE, now);
      if (removed > 0) yield* Effect.logInfo('cache pruned', { dir, removed });
    }
  }).pipe(Effect.repeat(Schedule.spaced('1 day')));
