import { Effect } from 'effect';
import { createReadStream } from 'node:fs';
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  utimes,
  writeFile,
} from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';

/** Turbo's task hashes: hex, 16 characters today. Anything else is refused. */
export const isArtifactHash = (hash: string) => /^[a-f0-9]{8,128}$/.test(hash);

/** What turbo sent with an artifact, given back when it is fetched. */
export interface ArtifactMeta {
  /** x-artifact-duration: how long the task took, in milliseconds. */
  readonly duration?: string;
  /** x-artifact-tag: the artifact's signature, when signing is on. */
  readonly tag?: string;
}

export interface Artifact {
  readonly size: number;
  readonly meta: ArtifactMeta;
  readonly body: () => ReadableStream<Uint8Array>;
}

export interface SweepLimits {
  /** Artifacts not read or written for this long are removed. */
  readonly maxAgeMs: number;
  /** Past this, the least recently used go first. */
  readonly maxBytes: number;
}

const metaOf = (text: string): ArtifactMeta => {
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed !== 'object' || parsed === null) return {};
  const field = (key: string) => {
    const value: unknown = Reflect.get(parsed, key);
    return typeof value === 'string' ? value : undefined;
  };
  return { duration: field('duration'), tag: field('tag') };
};

/**
 * Turbo's artifacts on disk: `<hash>` (the tarball) and `<hash>.meta`.
 * A read touches the file, so the sweep removes the least recently used.
 */
export function makeStore(dir: string) {
  const ready = mkdir(dir, { recursive: true });
  const fileOf = (hash: string) => join(dir, hash);

  const get = (hash: string) =>
    Effect.tryPromise(async (): Promise<Artifact | undefined> => {
      await ready;
      const file = fileOf(hash);
      const info = await stat(file).catch(() => undefined);
      if (!info?.isFile()) return undefined;
      const meta = await readFile(`${file}.meta`, 'utf8')
        .then(metaOf)
        .catch((): ArtifactMeta => ({}));
      const now = new Date();
      await utimes(file, now, now).catch(() => undefined);
      return {
        size: info.size,
        meta,
        body: () =>
          Readable.toWeb(createReadStream(file)) as ReadableStream<Uint8Array>,
      };
    });

  const put = (hash: string, bytes: Uint8Array, meta: ArtifactMeta) =>
    Effect.tryPromise(async () => {
      await ready;
      const file = fileOf(hash);
      const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
      await writeFile(`${file}.meta`, JSON.stringify(meta));
      await writeFile(temp, bytes);
      await rename(temp, file);
    });

  const sweep = ({ maxAgeMs, maxBytes }: SweepLimits) =>
    Effect.tryPromise(async () => {
      await ready;
      const all = await readdir(dir);
      // Uploads cut off by a restart leave a temp file behind.
      for (const name of all.filter((n) => n.endsWith('.tmp'))) {
        const info = await stat(join(dir, name)).catch(() => undefined);
        if (info && info.mtimeMs < Date.now() - 60 * 60 * 1000)
          await rm(join(dir, name), { force: true });
      }
      const names = all.filter(isArtifactHash);
      const found = await Promise.all(
        names.map(async (name) => {
          const info = await stat(fileOf(name)).catch(() => undefined);
          return info && { name, size: info.size, used: info.mtimeMs };
        })
      );
      const artifacts = found
        .filter((entry) => entry !== undefined)
        .sort((a, b) => b.used - a.used);
      const cutoff = Date.now() - maxAgeMs;
      let kept = 0;
      let removed = 0;
      for (const artifact of artifacts) {
        kept += artifact.size;
        if (artifact.used >= cutoff && kept <= maxBytes) continue;
        kept -= artifact.size;
        removed += 1;
        await rm(fileOf(artifact.name), { force: true });
        await rm(`${fileOf(artifact.name)}.meta`, { force: true });
      }
      return { kept, removed };
    });

  return { get, put, sweep };
}

export type Store = ReturnType<typeof makeStore>;
