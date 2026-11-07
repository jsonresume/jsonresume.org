import { FieldConfidence, type ImportKind } from '@repo/api';
import { Context, Effect, Layer, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';

/** What is kept of a read, to answer the same input again: never its text. */
export const Parsed = Schema.Struct({
  resume: Schema.Record(Schema.String, Schema.Unknown),
  confidence: Schema.Record(Schema.String, FieldConfidence),
  warnings: Schema.Array(Schema.String),
});
export type Parsed = typeof Parsed.Type;

/** One import, for quality and cost (app.imports). */
export interface ImportRecord {
  userId: string | null;
  kind: ImportKind;
  /** SHA-256 of the input, hex. */
  fileHash: string;
  ms: number;
  fields: number;
  /** The model that read it; null when no model did (LinkedIn exports). */
  model: string | null;
  /** The importer's version: a new version reads inputs again. */
  version: string;
  cached: boolean;
  /** Kept only on the row that read it; null on cache hits. */
  result: Parsed | null;
}

/** Days a parsed resume is kept for the cache; the stats row stays. */
export const KEEP_DAYS = 30;

const Row = Schema.Struct({ result: Schema.Unknown });
const decodeRows = Schema.decodeUnknownEffect(Schema.Array(Row));
const decodeParsed = Schema.decodeUnknownOption(Parsed);

/**
 * Imports in Postgres, and the cache by input hash. Never fails an import:
 * a database problem is logged, and the input is read again.
 */
export class ImportStore extends Context.Service<
  ImportStore,
  {
    find(
      fileHash: string,
      version: string
    ): Effect.Effect<Option.Option<Parsed>>;
    record(row: ImportRecord): Effect.Effect<void>;
  }
>()('@repo/resume-import/ImportStore') {
  /** Needs a SqlClient. */
  static readonly layer = Layer.effect(
    ImportStore,
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;
      return ImportStore.of({
        find: (fileHash, version) =>
          sql`
            SELECT result FROM app.imports
            WHERE file_hash = ${fileHash} AND version = ${version}
              AND result IS NOT NULL
              AND created_at > now() - make_interval(days => ${KEEP_DAYS})
            ORDER BY created_at DESC LIMIT 1
          `.pipe(
            Effect.flatMap(decodeRows),
            Effect.map((rows) =>
              Option.flatMap(Option.fromNullishOr(rows[0]), (r) =>
                decodeParsed(r.result)
              )
            ),
            Effect.tapError((e) =>
              Effect.logWarning('Import cache unreadable', { error: String(e) })
            ),
            Effect.orElseSucceed(() => Option.none<Parsed>())
          ),
        record: (row) =>
          sql`
            INSERT INTO app.imports
              (user_id, kind, file_hash, ms, fields, model, version, cached, result)
            VALUES (
              ${row.userId}, ${row.kind}, ${row.fileHash}, ${Math.round(
            row.ms
          )},
              ${row.fields}, ${row.model}, ${row.version}, ${row.cached},
              ${row.result === null ? null : JSON.stringify(row.result)}::jsonb
            )
          `.pipe(
            // Each import also forgets resumes read more than KEEP_DAYS ago.
            Effect.andThen(
              sql`
                UPDATE app.imports SET result = NULL
                WHERE result IS NOT NULL
                  AND created_at < now() - make_interval(days => ${KEEP_DAYS})
              `
            ),
            Effect.asVoid,
            Effect.tapError((e) =>
              Effect.logWarning('Import not recorded', { error: String(e) })
            ),
            Effect.ignore
          ),
      });
    })
  );
}
