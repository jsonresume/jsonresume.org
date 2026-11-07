import {
  IMPORT_MAX_BYTES,
  ImportFailed,
  ImportTooLarge,
  NothingToImport,
  UnsupportedImport,
  type ImportKind,
  type ImportResult,
} from '@repo/api';
import { tracker } from '@repo/posthog';
import { Clock, Context, Effect, Layer, Option } from 'effect';
import { createHash, randomUUID } from 'node:crypto';
import { score, type Unsure } from './confidence';
import { detect, type Source, type Upload } from './detect';
import { modelText, tidy } from './extract';
import { fromLinkedIn } from './linkedin';
import { ResumeReader } from './reader';
import { ImportStore } from './store';

/** Stored with each import: inputs read at another version are read again. */
export const IMPORT_VERSION = 'import-1';

/** A file, or pasted text. */
export type ImportInput =
  | { _tag: 'File'; upload: Upload }
  | { _tag: 'Text'; text: string };

export type ImportError =
  | UnsupportedImport
  | ImportTooLarge
  | NothingToImport
  | ImportFailed;

const sha256 = (data: Uint8Array | string) =>
  createHash('sha256').update(data).digest('hex');

const tooLarge = new ImportTooLarge({ maxBytes: IMPORT_MAX_BYTES });

/** Checks the size, works out what the input is, and hashes it. */
const prepare = (input: ImportInput) =>
  Effect.gen(function* () {
    if (input._tag === 'Text') {
      if (Buffer.byteLength(input.text) > IMPORT_MAX_BYTES)
        return yield* tooLarge;
      const text = tidy(input.text);
      const source: Source = { kind: 'text', text };
      return { source, hash: sha256(text) };
    }
    const { bytes } = input.upload;
    if (bytes.length > IMPORT_MAX_BYTES) return yield* tooLarge;
    if (bytes.length === 0)
      return yield* new NothingToImport({ message: 'That file is empty.' });
    return { source: yield* detect(input.upload), hash: sha256(bytes) };
  });

/**
 * Turns a resume (PDF, Word, LinkedIn export, text) into JSON Resume with
 * how sure it is of each field. Nothing is saved to the account: the person
 * reviews it first. Never keeps the file or its text; app.imports keeps the
 * hash, timings and counts, and the parsed result so the same input is read
 * once.
 */
export class Importer extends Context.Service<
  Importer,
  {
    run(
      input: ImportInput,
      userId?: string | null
    ): Effect.Effect<ImportResult, ImportError>;
  }
>()('@repo/resume-import/Importer') {
  /** Needs a ResumeReader and an ImportStore; reports to PostHog where it can. */
  static readonly layer = Layer.effect(
    Importer,
    Effect.gen(function* () {
      const reader = yield* ResumeReader;
      const store = yield* ImportStore;
      const track = yield* tracker;

      const read = (source: Source) =>
        Effect.gen(function* () {
          if (source.kind === 'linkedin') {
            const { resume, unsure } = fromLinkedIn(source.files);
            return { resume, unsure, warnings: [], model: null };
          }
          const { text, warnings } = yield* modelText(source);
          const reply = yield* reader.read(text);
          const unsure: ReadonlyArray<Unsure> = reply.unsure;
          return {
            resume: reply.resume,
            unsure,
            warnings,
            model: reader.model,
          };
        });

      const run = Effect.fn('Importer.run')(function* (
        input: ImportInput,
        userId?: string | null
      ) {
        const started = yield* Clock.currentTimeMillis;
        const { source, hash } = yield* prepare(input);
        const kind: ImportKind = source.kind;
        // Signed out: one id for this import's two events, and no person
        // made in PostHog for it.
        const distinct = userId ?? `import-${randomUUID()}`;
        const anonymous: Record<string, boolean> = userId
          ? {}
          : { $process_person_profile: false };
        yield* track(distinct, 'import_started', { kind, ...anonymous });
        const version = `${IMPORT_VERSION}:${
          kind === 'linkedin' ? 'rules' : reader.model
        }`;
        const elapsed = Effect.map(
          Clock.currentTimeMillis,
          (now) => now - started
        );
        const finish = (fields: number, cached: boolean, ok: boolean) =>
          Effect.flatMap(elapsed, (ms) =>
            track(distinct, 'import_finished', {
              kind,
              ms,
              fields_found: fields,
              cached,
              ok,
              ...anonymous,
            })
          );

        const hit = yield* store.find(hash, version);
        const parsed = Option.isSome(hit)
          ? hit.value
          : yield* Effect.gen(function* () {
              const got = yield* read(source);
              const scored = score(got.resume, got.unsure);
              if (scored.fields === 0)
                return yield* new NothingToImport({
                  message: 'No resume could be found in it.',
                });
              const result = {
                resume: scored.resume,
                confidence: scored.confidence,
                warnings: [...got.warnings, ...scored.warnings],
              };
              yield* store.record({
                userId: userId ?? null,
                kind,
                fileHash: hash,
                ms: yield* elapsed,
                fields: scored.fields,
                model: got.model,
                version,
                cached: false,
                result,
              });
              return result;
            }).pipe(Effect.tapError(() => finish(0, false, false)));
        const fields = Object.keys(parsed.confidence).length;
        const ms = yield* elapsed;
        const cached = Option.isSome(hit);
        if (cached) {
          yield* store.record({
            userId: userId ?? null,
            kind,
            fileHash: hash,
            ms,
            fields,
            model: null,
            version,
            cached: true,
            result: null,
          });
        }
        yield* finish(fields, cached, true);
        return { ...parsed, kind, fields, cached, ms };
      });

      return Importer.of({ run });
    })
  );
}
