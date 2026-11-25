import { emailLinks, Mailer } from '@repo/accounts';
import { AnalyticsStore } from '@repo/analytics';
import { Clock, Config, Effect, Redacted, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { runReports } from './run';

const Reader = Schema.Struct({
  id: Schema.String,
  email: Schema.String,
  username: Schema.String,
});
const decodeReaders = Schema.decodeUnknownEffect(Schema.Array(Reader));

/**
 * This month's reports, if due (runReports): confirmed accounts with the
 * report on, a real address and page views in the last 30 days.
 */
export const sendReports = Effect.gen(function* () {
  const mailer = yield* Mailer;
  if (!mailer.enabled) return 0;
  const sql = yield* SqlClient.SqlClient;
  const store = yield* AnalyticsStore;
  const secret = Redacted.value(yield* Config.Redacted('AUTH_SECRET'));
  const site = (yield* Config.String('SITE_URL').pipe(
    Config.withDefault('https://jsonresume.org')
  )).replace(/\/$/, '');
  const now = new Date(yield* Clock.currentTimeMillis);
  return yield* runReports(
    {
      due: (kind, since, limit) =>
        sql`
          SELECT u.id, u.email, p.username
          FROM app.users u
          JOIN app.profiles p ON p.user_id = u.id AND p.kind = 'account'
          WHERE u.email IS NOT NULL AND u.monthly_report
            AND (u.email_verified_at IS NOT NULL OR u.github_id IS NOT NULL)
            AND u.email NOT LIKE '%@users.noreply.github.com'
            AND NOT EXISTS (SELECT 1 FROM app.account_emails e
                            WHERE e.user_id = u.id AND e.kind = ${kind})
            AND EXISTS (SELECT 1 FROM app.resume_views v
                        WHERE v.username = p.username AND v.kind = 'page'
                          AND v.viewed_at > ${since})
          ORDER BY u.created_at
          LIMIT ${limit}`.pipe(
          Effect.flatMap(decodeReaders),
          Effect.map((rows) =>
            rows.map((r) => ({
              userId: r.id,
              email: r.email,
              username: r.username,
            }))
          ),
          Effect.orDie
        ),
      sentSince: (kind, since) =>
        sql<{ n: number }>`
          SELECT count(*)::int AS n FROM app.account_emails
          WHERE kind = ${kind} AND sent_at >= ${since}`.pipe(
          Effect.map((rows) => Number(rows[0]?.n ?? 0)),
          Effect.orDie
        ),
      overview: (username) => store.overview(username, '30d'),
      claim: (userId, kind) =>
        sql<{ kind: string }>`
          INSERT INTO app.account_emails (user_id, kind) VALUES (${userId}, ${kind})
          ON CONFLICT DO NOTHING RETURNING kind`.pipe(
          Effect.map((rows) => rows.length > 0),
          Effect.orDie
        ),
      links: (userId) => emailLinks(site, secret, userId, 'report'),
      send: mailer.send,
    },
    now,
    site
  );
});
