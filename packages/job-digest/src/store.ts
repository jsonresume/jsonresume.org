import { Effect, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';

const Subscriber = Schema.Struct({ id: Schema.String, email: Schema.String });
export type Subscriber = typeof Subscriber.Type;
const decodeSubscribers = Schema.decodeUnknownEffect(Schema.Array(Subscriber));

/** Who gets the weekly email, and which jobs each has been sent. */
export const digestStore = (sql: SqlClient.SqlClient) => ({
  /** Turned on, with a confirmed address to send to. */
  subscribers: Effect.fn('JobDigest.subscribers')(function* () {
    const rows = yield* sql`
      SELECT u.id::text AS id, u.email
      FROM app.job_preferences p
      JOIN app.users u ON u.id = p.user_id
      WHERE (p.preferences->>'weeklyEmail')::boolean IS TRUE
        AND u.email IS NOT NULL AND u.email_verified_at IS NOT NULL
      ORDER BY u.created_at`;
    return yield* decodeSubscribers(rows);
  }),
  sent: Effect.fn('JobDigest.sent')(function* (userId: string) {
    const rows = yield* sql<{ job_id: string | number }>`
      SELECT job_id FROM app.job_digests WHERE user_id = ${userId}`;
    return new Set(rows.map((r) => Number(r.job_id)));
  }),
  record: (userId: string, jobIds: ReadonlyArray<number>) =>
    sql`
      INSERT INTO app.job_digests ${sql.insert(
        jobIds.map((jobId) => ({ user_id: userId, job_id: jobId }))
      )}
      ON CONFLICT DO NOTHING`.pipe(Effect.asVoid),
});
