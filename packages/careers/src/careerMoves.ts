import { Seniority } from '@repo/api';
import { Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { isFamily } from './families';
import { CareerMoves, type Move } from './services';
import { titleRoles } from './titleFamilies';
import { TitleReader } from './titleReader';

const Row = Schema.Struct({
  to_family: Schema.String,
  to_seniority: Seniority,
  people: Schema.Number,
  median_years: Schema.NullOr(Schema.Number),
});
const rows = Schema.decodeUnknownEffect(Schema.Array(Row));

/** Next roles shown from one role, at most. */
const TOP = 12;

/**
 * CareerMoves on app.career_moves (filled by refreshMoves) and
 * app.title_families. Reads new titles with a TitleReader when one is
 * provided; without one they get a keyword guess, not stored.
 */
export const CareerMovesLive = Layer.effect(
  CareerMoves,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const reader = yield* Effect.serviceOption(TitleReader);
    return CareerMoves.of({
      from: Effect.fn('CareerMoves.from')(function* (family, seniority) {
        const found = yield* sql`
          SELECT to_family, to_seniority, people::float8 AS people,
                 median_years::float8 AS median_years
          FROM app.career_moves
          WHERE from_family = ${family} AND from_seniority = ${seniority}
          ORDER BY people DESC, to_family, to_seniority
        `.pipe(Effect.flatMap(rows), Effect.orDie);
        const total = found.reduce((sum, r) => sum + r.people, 0);
        return found.slice(0, TOP).flatMap((r): Move[] =>
          isFamily(r.to_family)
            ? [
                {
                  family: r.to_family,
                  seniority: r.to_seniority,
                  people: r.people,
                  share: total > 0 ? Math.round((100 * r.people) / total) : 0,
                  medianYears:
                    r.median_years === null
                      ? null
                      : Math.round(r.median_years * 10) / 10,
                },
              ]
            : []
        );
      }),
      familiesOf: (titles) =>
        titleRoles(
          sql,
          reader,
          titles.map((title) => ({ title }))
        ).pipe(Effect.map(({ roles }) => roles)),
    });
  })
);
