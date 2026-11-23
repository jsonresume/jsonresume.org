import { Duration, Effect } from 'effect';
import { mkdtemp, readdir, rm, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { pruneDir } from './prune';

let dir = '';
afterEach(() => rm(dir, { recursive: true, force: true }));

describe('pruning a disk cache', () => {
  it('removes files older than the limit and keeps the rest', async () => {
    dir = await mkdtemp(join(tmpdir(), 'prune-'));
    await writeFile(join(dir, 'old.png'), 'x');
    await writeFile(join(dir, 'new.png'), 'x');
    const longAgo = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000);
    await utimes(join(dir, 'old.png'), longAgo, longAgo);
    const removed = await Effect.runPromise(
      pruneDir(dir, Duration.days(30), Date.now())
    );
    expect(removed).toBe(1);
    expect(await readdir(dir)).toEqual(['new.png']);
  });

  it('treats a missing directory as empty', async () => {
    dir = join(tmpdir(), 'no-such-cache-dir');
    expect(
      await Effect.runPromise(pruneDir(dir, Duration.days(30), Date.now()))
    ).toBe(0);
  });
});
