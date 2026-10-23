import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { PgAnalyticsStore } from './sql';
import { AnalyticsStore, type ViewRecord } from './store';

const layer = PgAnalyticsStore.pipe(Layer.provideMerge(TestDatabase));
const run = <A, E>(
  effect: Effect.Effect<A, E, AnalyticsStore | SqlClient.SqlClient>
) => Effect.runPromise(effect.pipe(Effect.provide(layer)));

let n = 0;
const view = (over: Partial<ViewRecord> = {}): ViewRecord => ({
  id: `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`,
  username: 'ada',
  kind: 'page',
  theme: 'elegant',
  referrer: null,
  country: 'AU',
  device: 'desktop',
  browser: 'Firefox',
  visitor: 'v1',
  ...over,
});

describe('PgAnalyticsStore', () => {
  it('counts views, visitors, time and depth for the range, with deltas and days', () =>
    run(
      Effect.gen(function* () {
        const store = yield* AnalyticsStore;
        const sql = yield* SqlClient.SqlClient;
        const a = view();
        yield* store.recordView(a);
        yield* store.recordView(a); // a repeated beacon counts once
        yield* store.recordPing(a.id, 40, 80);
        yield* store.recordPing(a.id, 10, 20); // pings never shrink a view
        yield* store.recordView(
          view({ visitor: 'v2', referrer: 'linkedin.com', device: 'mobile' })
        );
        yield* store.recordView(view({ kind: 'json' }));
        yield* store.recordView(view({ username: 'bea' }));
        // One view ten days ago: outside 7d, inside the previous 7d.
        const old = view({ visitor: 'v3' });
        yield* store.recordView(old);
        yield* sql`UPDATE app.resume_views SET viewed_at = now() - interval '10 days' WHERE id = ${old.id}`;

        const week = yield* store.overview('ada', '7d');
        expect(week.totals).toEqual({
          views: 2,
          visitors: 2,
          medianSeconds: 40,
          readDepth: 80,
          dataReads: 1,
        });
        expect(week.previous.views).toBe(1);
        expect(week.daily).toHaveLength(7);
        expect(week.daily.at(-1)).toMatchObject({ views: 2, visitors: 2 });
        expect(week.referrers).toEqual([
          { label: 'Direct', value: 1 },
          { label: 'linkedin.com', value: 1 },
        ]);
        expect(week.devices[0]).toEqual({ label: 'desktop', value: 1 });
        expect(week.recent).toHaveLength(3);
        expect((yield* store.overview('ada', '30d')).totals.views).toBe(3);
        expect((yield* store.overview('nobody', '90d')).daily).toHaveLength(90);
      })
    ));
});
