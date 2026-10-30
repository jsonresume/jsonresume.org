import { Seniority } from '@repo/api';
import { Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { isFamily } from './families';
import { CareerMoves, type Move } from './services';
import { titleRoles } from './titleFamilies';
import { TitleReader } from './titleReader';

const Row = Schema.Struct({
  from_family: Schema.String,
  from_seniority: Seniority,
  to_family: Schema.String,
  to_seniority: Seniority,
  people: Schema.Number,
  median_years: Schema.NullOr(Schema.Number),
});
type Row = typeof Row.Type;
const rows = Schema.decodeUnknownEffect(Schema.Array(Row));

/** Next roles shown from one role, at most. */
const TOP = 12;
/** People a sample needs before its shares mean much. */
const ENOUGH = 25;
/** Not places to head for. */
const NOWHERE: ReadonlySet<string> = new Set([
  'other_tech',
  'non_tech',
  'student',
]);

/**
 * The moves from a role, summed by where they went, from the narrowest
 * sample with enough people: the role at that level, the role at any level,
 * then any role at that level. Too few everywhere: the role at that level.
 */
const sample = (
  found: ReadonlyArray<Row>,
  family: string,
  seniority: string
) => {
  const pools: ReadonlyArray<[Move['basis'], (r: Row) => boolean]> = [
    ['role', (r) => r.from_family === family && r.from_seniority === seniority],
    ['family', (r) => r.from_family === family],
    ['level', (r) => r.from_seniority === seniority],
  ];
  const summed = pools.map(([basis, keep]) => {
    const by = new Map<
      string,
      { row: Row; people: number; years: number; dated: number }
    >();
    for (const r of found.filter(keep)) {
      const key = `${r.to_family}:${r.to_seniority}`;
      const was = by.get(key) ?? { row: r, people: 0, years: 0, dated: 0 };
      const dated = r.median_years === null ? 0 : r.people;
      by.set(key, {
        row: r,
        people: was.people + r.people,
        years: was.years + (r.median_years ?? 0) * dated,
        dated: was.dated + dated,
      });
    }
    const total = [...by.values()].reduce((sum, m) => sum + m.people, 0);
    return { basis, total, moves: [...by.values()] };
  });
  return summed.find((p) => p.total >= ENOUGH) ?? summed[0];
};

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
          SELECT from_family, from_seniority, to_family, to_seniority,
                 people::float8 AS people, median_years::float8 AS median_years
          FROM app.career_moves
          WHERE from_family = ${family} OR from_seniority = ${seniority}
        `.pipe(Effect.flatMap(rows), Effect.orDie);
        const pool = sample(found, family, seniority);
        if (!pool) return [];
        return pool.moves
          .filter(
            (m) =>
              !NOWHERE.has(m.row.to_family) &&
              !(m.row.to_family === family && m.row.to_seniority === seniority)
          )
          .sort(
            (a, b) =>
              b.people - a.people ||
              a.row.to_family.localeCompare(b.row.to_family) ||
              a.row.to_seniority.localeCompare(b.row.to_seniority)
          )
          .slice(0, TOP)
          .flatMap((m): Move[] =>
            isFamily(m.row.to_family)
              ? [
                  {
                    family: m.row.to_family,
                    seniority: m.row.to_seniority,
                    people: m.people,
                    share: Math.round((100 * m.people) / pool.total),
                    medianYears:
                      m.dated > 0
                        ? Math.round((m.years / m.dated) * 10) / 10
                        : null,
                    basis: pool.basis,
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
