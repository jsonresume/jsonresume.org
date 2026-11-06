import { CareerGraph, PlanNotFound } from '@repo/api';
import { Context, Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';

const Stored = Schema.Struct({ graph: Schema.Unknown });
const decodeGraph = Schema.decodeUnknownEffect(CareerGraph);

/** "2026-10" for a date. */
export const monthOf = (date: Date) => date.toISOString().slice(0, 7);

/**
 * The career graph as it was each month (app.tree_snapshots): the first
 * graph of a month is kept, so the tree can be replayed as it grew.
 */
export class Snapshots extends Context.Service<
  Snapshots,
  Effect.Success<typeof make>
>()('@repo/careers/Snapshots') {
  static readonly layer = Layer.effect(
    Snapshots,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  /** Keeps the graph as this month's, unless the month has one already. */
  const keep = (userId: string, graph: CareerGraph, now: Date) =>
    sql`
      INSERT INTO app.tree_snapshots (user_id, taken_on, graph)
      VALUES (${userId}, ${`${monthOf(now)}-01`}, ${JSON.stringify({
      ...graph,
      snapshots: [],
    })}::jsonb)
      ON CONFLICT (user_id, taken_on) DO NOTHING
    `.pipe(Effect.asVoid, Effect.orDie);

  const months = (userId: string) =>
    sql<{ month: string }>`
      SELECT to_char(taken_on, 'YYYY-MM') AS month FROM app.tree_snapshots
      WHERE user_id = ${userId} ORDER BY taken_on DESC
    `.pipe(
      Effect.map((found) => found.map((r) => r.month)),
      Effect.orDie
    );

  const at = (userId: string, month: string) =>
    Effect.gen(function* () {
      if (!/^\d{4}-\d{2}$/.test(month)) return yield* new PlanNotFound();
      const [row] = yield* sql`
        SELECT graph FROM app.tree_snapshots
        WHERE user_id = ${userId} AND taken_on = ${`${month}-01`}::date
      `.pipe(
        Effect.flatMap(Schema.decodeUnknownEffect(Schema.Array(Stored))),
        Effect.orDie
      );
      if (!row) return yield* new PlanNotFound();
      const graph = yield* decodeGraph(row.graph).pipe(Effect.orDie);
      return { ...graph, snapshots: yield* months(userId) };
    });

  return { keep, months, at };
});
