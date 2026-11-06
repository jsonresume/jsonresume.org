import { Seniority } from '@repo/api';
import { Effect, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import type { Evidence, Foundation, Strength } from './services';

const InsightRow = Schema.Struct({
  level: Seniority,
  strengths: Schema.Unknown,
  foundations: Schema.Unknown,
  model: Schema.String,
});
const EvidenceRow = Schema.Struct({
  entry: Schema.String,
  skill_id: Schema.Number,
  key: Schema.String,
  name: Schema.String,
  strength: Schema.Number,
  last_year: Schema.NullOr(Schema.Number),
  quote: Schema.String,
});

/** Each entry's role, as the reader saw it. */
export const EntryRole = Schema.Struct({
  family: Schema.String,
  seniority: Seniority,
});
/** What resume_insights.strengths holds: the themes, and each entry's role. */
const Read = Schema.Struct({
  themes: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      summary: Schema.String,
      entries: Schema.Array(Schema.String),
      skills: Schema.Array(Schema.Number),
    })
  ),
  roles: Schema.Record(Schema.String, EntryRole),
});
const decodeRead = Schema.decodeUnknownOption(Read);
const decodeRows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

export interface Stored {
  model: string;
  level: typeof Seniority.Type;
  strengths: ReadonlyArray<Strength>;
  roles: Readonly<Record<string, typeof EntryRole.Type>>;
  evidence: ReadonlyArray<Evidence>;
}

const strength = (n: number): 1 | 2 | 3 => (n >= 3 ? 3 : n <= 1 ? 1 : 2);

/** app.resume_insights and app.resume_evidence, by resume key. */
export const insightStore = (sql: SqlClient.SqlClient) => {
  const load = (key: string) =>
    Effect.gen(function* () {
      const [row] = yield* sql`
        SELECT level, strengths, foundations, model FROM app.resume_insights
        WHERE resume_key = ${key}
      `.pipe(Effect.flatMap(decodeRows(InsightRow)));
      if (!row) return Option.none<Stored>();
      const evidence = yield* sql`
        SELECT e.entry, e.skill_id, s.key, s.name, e.strength, e.last_year, e.quote
        FROM app.resume_evidence e JOIN app.skills s ON s.id = e.skill_id
        WHERE e.resume_key = ${key} ORDER BY e.entry, e.strength DESC, s.name
      `.pipe(Effect.flatMap(decodeRows(EvidenceRow)));
      const read = Option.getOrElse(decodeRead(row.strengths), () => ({
        themes: [],
        roles: {},
      }));
      return Option.some<Stored>({
        model: row.model,
        level: row.level,
        strengths: read.themes,
        roles: read.roles,
        evidence: evidence.map((e) => ({
          entry: e.entry,
          skill: { id: e.skill_id, key: e.key, name: e.name },
          strength: strength(e.strength),
          lastYear: e.last_year,
          quote: e.quote,
        })),
      });
    }).pipe(Effect.orDie);

  /** Replaces the insight for a key, and its evidence. */
  const save = (
    key: string,
    insight: Omit<Stored, 'evidence'> & {
      foundations: ReadonlyArray<Foundation>;
      evidence: ReadonlyArray<Evidence>;
    }
  ) =>
    Effect.gen(function* () {
      const read = { themes: insight.strengths, roles: insight.roles };
      yield* sql`
        INSERT INTO app.resume_insights (resume_key, level, strengths, foundations, model)
        VALUES (${key}, ${insight.level}, ${JSON.stringify(read)}::jsonb,
                ${JSON.stringify(insight.foundations)}::jsonb, ${insight.model})
        ON CONFLICT (resume_key) DO UPDATE SET level = EXCLUDED.level,
          strengths = EXCLUDED.strengths, foundations = EXCLUDED.foundations,
          model = EXCLUDED.model, created_at = now()
      `;
      yield* sql`DELETE FROM app.resume_evidence WHERE resume_key = ${key}`;
      // One row per entry and skill: the strongest.
      const best = new Map<string, Evidence>();
      for (const e of insight.evidence) {
        const id = `${e.entry}\n${e.skill.id}`;
        const had = best.get(id);
        if (!had || e.strength > had.strength) best.set(id, e);
      }
      if (best.size === 0) return;
      yield* sql`
        INSERT INTO app.resume_evidence ${sql.insert(
          [...best.values()].map((e) => ({
            resume_key: key,
            entry: e.entry,
            skill_id: e.skill.id,
            strength: e.strength,
            last_year: e.lastYear,
            quote: e.quote.slice(0, 300),
          }))
        )}
      `;
    }).pipe(sql.withTransaction, Effect.orDie);

  return { load, save };
};
