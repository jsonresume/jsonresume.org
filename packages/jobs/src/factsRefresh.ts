import { Effect, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { openJobs } from './board';
import { CompanyFacts, FACTS_VERSION, FactsReader, noFacts } from './facts';
import { postText } from './postText';

const Unread = Schema.Struct({ id: Schema.Number, html: Schema.String });
const Stored = Schema.Struct({
  job_id: Schema.Number,
  facts: Schema.fromJsonString(CompanyFacts),
});
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** Posts one call reads. */
const BATCH = 20;

/**
 * Reads company facts for open posts without them (at FACTS_VERSION) and
 * stores them. A post the model skips gets none, so it isn't asked again
 * every run. Without a FactsReader (no OpenAI key) it does nothing.
 */
export const refreshFacts = Effect.fn('Jobs.refreshFacts')(function* (
  options: { limit?: number; concurrency?: number } = {}
) {
  const sql = yield* SqlClient.SqlClient;
  const reader = yield* Effect.serviceOption(FactsReader);
  if (Option.isNone(reader)) return { read: 0, failed: 0 };
  const unread = yield* sql`
    SELECT j.id::float8 AS id, j.html FROM app.jobs j
    WHERE ${sql.literal(openJobs)} AND NOT EXISTS (
      SELECT 1 FROM app.job_facts f WHERE f.job_id = j.id AND f.model = ${FACTS_VERSION})
    ORDER BY j.posted_at DESC LIMIT ${options.limit ?? 2000}
  `.pipe(Effect.flatMap(rows(Unread)), Effect.orDie);
  const batches = Array.from(
    { length: Math.ceil(unread.length / BATCH) },
    (_, i) => unread.slice(i * BATCH, (i + 1) * BATCH)
  );
  let failed = 0;
  yield* Effect.forEach(
    batches,
    (batch) =>
      reader.value
        .read(batch.map((p) => ({ id: p.id, text: postText(p.html) })))
        .pipe(
          Effect.flatMap((read) =>
            Effect.forEach(
              batch,
              (p) => {
                const facts = JSON.stringify(read.get(p.id) ?? noFacts);
                return sql`
                  INSERT INTO app.job_facts (job_id, facts, model)
                  VALUES (${p.id}, ${facts}, ${FACTS_VERSION})
                  ON CONFLICT (job_id) DO UPDATE
                    SET facts = EXCLUDED.facts, model = EXCLUDED.model, read_at = now()
                `;
              },
              { discard: true }
            ).pipe(Effect.orDie)
          ),
          Effect.catchTag('FactsFailed', (e) =>
            Effect.sync(() => {
              failed += batch.length;
            }).pipe(
              Effect.andThen(
                Effect.logWarning('Company facts failed', { error: e.message })
              )
            )
          )
        ),
    { concurrency: options.concurrency ?? 4, discard: true }
  );
  return { read: unread.length - failed, failed };
});

/** The stored facts of these jobs. */
export const factsOf = (sql: SqlClient.SqlClient, ids: ReadonlyArray<number>) =>
  ids.length === 0
    ? Effect.succeed(new Map<number, CompanyFacts>())
    : sql`
        SELECT job_id::float8 AS job_id, facts::text AS facts
        FROM app.job_facts WHERE job_id IN ${sql.in(ids)}
      `.pipe(
        Effect.flatMap(rows(Stored)),
        Effect.map((found) => new Map(found.map((f) => [f.job_id, f.facts]))),
        Effect.orDie
      );
