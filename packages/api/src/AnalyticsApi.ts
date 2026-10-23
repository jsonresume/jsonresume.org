import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';

export const AnalyticsRange = Schema.Literals(['7d', '30d', '90d']);
export type AnalyticsRange = typeof AnalyticsRange.Type;

export const Totals = Schema.Struct({
  /** Page views of the themed resume. */
  views: Schema.Number,
  /** Distinct visitors (a daily salted hash, no cookies). */
  visitors: Schema.Number,
  /** Median seconds the page was visible. */
  medianSeconds: Schema.Number,
  /** Average of how far down readers scrolled, 0 to 100. */
  readDepth: Schema.Number,
  /** Requests for .json, .yaml and .txt. */
  dataReads: Schema.Number,
});
export type Totals = typeof Totals.Type;

export const Breakdown = Schema.Array(
  Schema.Struct({ label: Schema.String, value: Schema.Number })
);

export const RecentView = Schema.Struct({
  viewedAt: Schema.String,
  kind: Schema.Literals(['page', 'json', 'yaml', 'txt']),
  country: Schema.NullOr(Schema.String),
  device: Schema.NullOr(Schema.String),
  browser: Schema.NullOr(Schema.String),
  referrer: Schema.NullOr(Schema.String),
  seconds: Schema.Number,
});

/** Everything the dashboard shows for one range, all from the same slice. */
export class Overview extends Schema.Class<Overview>('@repo/api/Overview')({
  range: AnalyticsRange,
  totals: Totals,
  /** The same totals for the range before, for deltas. */
  previous: Totals,
  /** One row per day in the range, oldest first, zeros included. */
  daily: Schema.Array(
    Schema.Struct({
      date: Schema.String,
      views: Schema.Number,
      visitors: Schema.Number,
    })
  ),
  referrers: Breakdown,
  countries: Breakdown,
  devices: Breakdown,
  browsers: Breakdown,
  themes: Breakdown,
  recent: Schema.Array(RecentView),
}) {}

export class AnalyticsApi extends HttpApiGroup.make('analytics')
  .add(
    HttpApiEndpoint.get('overview', '/overview', {
      query: { range: AnalyticsRange },
      success: Overview,
    })
  )
  .middleware(Authentication)
  .prefix('/analytics') {}
