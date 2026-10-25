import { Effect, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';

const Ids = Schema.Array(Schema.Struct({ id: Schema.Number }));

/** Each pipeline run in app.job_runs: when, its counts, or its error. */
export const runs = (sql: SqlClient.SqlClient) => ({
  startRun: sql`
    INSERT INTO app.job_runs DEFAULT VALUES RETURNING id::float8 AS id
  `.pipe(
    Effect.flatMap(Schema.decodeUnknownEffect(Ids)),
    Effect.map((rows) => rows[0]?.id ?? 0),
    Effect.orDie
  ),
  finishRun: (id: number, stats: Record<string, number>, error?: string) =>
    sql`
      UPDATE app.job_runs SET finished_at = now(), ok = ${error === undefined},
        stats = ${JSON.stringify(stats)}::jsonb, error = ${error ?? null}
      WHERE id = ${id}
    `.pipe(Effect.asVoid, Effect.orDie),
});
