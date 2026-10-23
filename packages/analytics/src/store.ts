import type { AnalyticsRange, Overview } from '@repo/api';
import { Context, type Effect } from 'effect';

/** One view or data read, as stored: no address, no cookie. */
export interface ViewRecord {
  id: string;
  username: string;
  kind: 'page' | 'json' | 'yaml' | 'txt';
  theme: string | null;
  referrer: string | null;
  /** Two-letter code from Cloudflare (CF-IPCountry), when known. */
  country: string | null;
  device: string | null;
  browser: string | null;
  /** A daily salted hash; see visitorId. */
  visitor: string;
}

/** Where views are kept. Postgres in production (./sql) and tests. */
export class AnalyticsStore extends Context.Service<
  AnalyticsStore,
  {
    recordView(view: ViewRecord): Effect.Effect<void>;
    recordPing(id: string, seconds: number, depth: number): Effect.Effect<void>;
    overview(username: string, range: AnalyticsRange): Effect.Effect<Overview>;
  }
>()('@repo/analytics/AnalyticsStore') {}
