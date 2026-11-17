import { JobDecision, JobMark, PassReason, RemoteScope } from '@repo/api';
import { Effect, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';
import { CompanyFacts, noFacts } from './facts';
import type { MarkedFacts } from './decision';

const MarkRow = Schema.Struct({
  state: JobMark,
  reason: Schema.NullOr(PassReason),
  facts: Schema.NullOr(Schema.fromJsonString(CompanyFacts)),
  remote: Schema.NullOr(RemoteScope),
});
const rows = Schema.decodeUnknownEffect(Schema.Array(MarkRow));
const encodeReasons = Schema.encodeSync(
  Schema.fromJsonString(JobDecision.fields.reasons)
);

/** Decisions kept, and marks read back with what the jobs were. */
export const decisionStore = (sql: SqlClient.SqlClient) => {
  /** Every mark with its job's company facts, workplace and the latest reason given. */
  const markedFacts = (userId: string) =>
    sql`
      SELECT m.state, f.facts::text AS facts, j.parsed->>'remote' AS remote,
        (SELECT e.reason FROM app.job_mark_events e
          WHERE e.user_id = m.user_id AND e.job_id = m.job_id AND e.reason IS NOT NULL
          ORDER BY e.created_at DESC LIMIT 1) AS reason
      FROM app.job_marks m
      JOIN app.jobs j ON j.id = m.job_id
      LEFT JOIN app.job_facts f ON f.job_id = m.job_id
      WHERE m.user_id = ${userId}
    `.pipe(
      Effect.flatMap(rows),
      Effect.map((found) =>
        found.map(
          (r): MarkedFacts => ({
            state: r.state,
            reason: r.reason,
            sectors: (r.facts ?? noFacts).sectors,
            remote: r.remote ?? 'unspecified',
          })
        )
      ),
      Effect.orDie
    );

  /** Keeps the latest decision on each job, for marks and evaluation to look back on. */
  const keep = (
    userId: string,
    model: string,
    decided: ReadonlyArray<{ id: number; decision: JobDecision }>
  ) =>
    decided.length === 0
      ? Effect.void
      : sql`
          INSERT INTO app.job_decisions ${sql.insert(
            decided.map(({ id, decision: d }) => ({
              user_id: userId,
              job_id: id,
              verdict: d.verdict,
              chance: d.chance,
              appeal: d.appeal,
              value: d.value,
              reasons: encodeReasons(d.reasons),
              model,
            }))
          )}
          ON CONFLICT (user_id, job_id) DO UPDATE SET verdict = EXCLUDED.verdict,
            chance = EXCLUDED.chance, appeal = EXCLUDED.appeal, value = EXCLUDED.value,
            reasons = EXCLUDED.reasons, model = EXCLUDED.model, decided_at = now()
        `.pipe(Effect.asVoid, Effect.orDie);

  return { markedFacts, keep };
};
