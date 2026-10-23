import { Overview, type AnalyticsRange, type Totals } from '@repo/api';
import { PgLive } from '@repo/database';
import { Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { AnalyticsStore } from './store';

const days: Record<AnalyticsRange, number> = { '7d': 7, '30d': 30, '90d': 90 };

const TotalsRow = Schema.Struct({
  views: Schema.Number,
  visitors: Schema.Number,
  median_seconds: Schema.Number,
  read_depth: Schema.Number,
  data_reads: Schema.Number,
});
const Count = Schema.Struct({ label: Schema.String, value: Schema.Number });
const Day = Schema.Struct({
  date: Schema.String,
  views: Schema.Number,
  visitors: Schema.Number,
});
const Recent = Schema.Struct({
  viewed_at: Schema.Date,
  kind: Schema.Literals(['page', 'json', 'yaml', 'txt']),
  country: Schema.NullOr(Schema.String),
  device: Schema.NullOr(Schema.String),
  browser: Schema.NullOr(Schema.String),
  referrer: Schema.NullOr(Schema.String),
  seconds: Schema.Number,
});
const decode = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

const toTotals = (row: typeof TotalsRow.Type | undefined): Totals => ({
  views: row?.views ?? 0,
  visitors: row?.visitors ?? 0,
  medianSeconds: Math.round(row?.median_seconds ?? 0),
  readDepth: Math.round(row?.read_depth ?? 0),
  dataReads: row?.data_reads ?? 0,
});

/** AnalyticsStore on Postgres. Days are UTC; the range ends today. */
export const PgAnalyticsStore = Layer.effect(
  AnalyticsStore,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    const totals = (username: string, from: number, to: number) =>
      sql`
        SELECT count(*) FILTER (WHERE kind = 'page')::int AS views,
               count(DISTINCT visitor) FILTER (WHERE kind = 'page')::int AS visitors,
               coalesce(percentile_cont(0.5) WITHIN GROUP (ORDER BY visible_seconds)
                 FILTER (WHERE kind = 'page' AND visible_seconds > 0), 0)::float8 AS median_seconds,
               coalesce(avg(read_depth) FILTER (WHERE kind = 'page' AND read_depth > 0), 0)::float8 AS read_depth,
               count(*) FILTER (WHERE kind <> 'page')::int AS data_reads
        FROM app.resume_views
        WHERE username = ${username}
          AND viewed_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' - make_interval(days => ${from})
          AND viewed_at < date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' + make_interval(days => ${
            1 - to
          })
      `.pipe(
        Effect.flatMap(decode(TotalsRow)),
        Effect.map((rows) => toTotals(rows[0]))
      );

    const within = (username: string, n: number) => sql`
      username = ${username} AND viewed_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' - make_interval(days => ${
      n - 1
    })`;

    const top = (
      username: string,
      n: number,
      column: 'referrer' | 'country' | 'device' | 'browser' | 'theme',
      fallback: string
    ) =>
      sql`
        SELECT coalesce(${sql(
          column
        )}, ${fallback}) AS label, count(*)::int AS value
        FROM app.resume_views WHERE kind = 'page' AND ${within(username, n)}
        GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT 10
      `.pipe(Effect.flatMap(decode(Count)));

    const overview = Effect.fn('AnalyticsStore.overview')(function* (
      username: string,
      range: AnalyticsRange
    ) {
      const n = days[range];
      const daily = yield* sql`
        SELECT to_char(d, 'YYYY-MM-DD') AS date,
               count(v.id) FILTER (WHERE v.kind = 'page')::int AS views,
               count(DISTINCT v.visitor) FILTER (WHERE v.kind = 'page')::int AS visitors
        FROM generate_series(
          (now() AT TIME ZONE 'UTC')::date - ${
            n - 1
          }::int, (now() AT TIME ZONE 'UTC')::date, interval '1 day'
        ) AS d
        LEFT JOIN app.resume_views v ON v.username = ${username}
          AND (v.viewed_at AT TIME ZONE 'UTC')::date = d::date
        GROUP BY d ORDER BY d
      `.pipe(Effect.flatMap(decode(Day)));
      const recent = yield* sql`
        SELECT viewed_at, kind, country, device, browser, referrer, visible_seconds::int AS seconds
        FROM app.resume_views WHERE ${within(username, n)}
        ORDER BY viewed_at DESC LIMIT 20
      `.pipe(Effect.flatMap(decode(Recent)));
      const [
        current,
        previous,
        referrers,
        countries,
        devices,
        browsers,
        themes,
      ] = yield* Effect.all(
        [
          totals(username, n - 1, 0),
          totals(username, 2 * n - 1, n),
          top(username, n, 'referrer', 'Direct'),
          top(username, n, 'country', 'Unknown'),
          top(username, n, 'device', 'Unknown'),
          top(username, n, 'browser', 'Other'),
          top(username, n, 'theme', 'Default'),
        ],
        { concurrency: 'unbounded' }
      );
      return new Overview({
        range,
        totals: current,
        previous,
        daily,
        referrers,
        countries,
        devices,
        browsers,
        themes,
        recent: recent.map((r) => ({
          ...r,
          viewedAt: r.viewed_at.toISOString(),
        })),
      });
    },
    Effect.orDie);

    return AnalyticsStore.of({
      recordView: (view) =>
        sql`
          INSERT INTO app.resume_views (id, username, kind, theme, referrer, country, device, browser, visitor)
          VALUES (${view.id}, ${view.username}, ${view.kind}, ${view.theme}, ${view.referrer},
                  ${view.country}, ${view.device}, ${view.browser}, ${view.visitor})
          ON CONFLICT (id) DO NOTHING
        `.pipe(Effect.asVoid, Effect.orDie),
      // Pings only grow a view, and only within a day of it opening.
      recordPing: (id, seconds, depth) =>
        sql`
          UPDATE app.resume_views
          SET visible_seconds = greatest(visible_seconds, ${Math.round(
            seconds
          )}),
              read_depth = greatest(read_depth, ${Math.round(depth)})
          WHERE id = ${id} AND kind = 'page' AND viewed_at > now() - interval '1 day'
        `.pipe(Effect.asVoid, Effect.orDie),
      overview,
    });
  })
);

export const PgAnalyticsStoreLive = PgAnalyticsStore.pipe(
  Layer.provide(PgLive)
);
