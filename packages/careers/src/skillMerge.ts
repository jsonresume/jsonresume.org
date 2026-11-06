import { Effect, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { decodeRead } from './insightStore';
import type { Skill } from './services';
import { isKnownSkill, skillKey, skillName } from './skillNames';

/** One skill kept under its key and name, and the skills folded into it. */
export interface Merge {
  keep: number;
  key: string;
  name: string;
  drop: ReadonlyArray<number>;
}

/** The name a skill shows: its known name, else the first spelling with capitals. */
const bestName = (key: string, names: ReadonlyArray<string>) =>
  isKnownSkill(key)
    ? skillName(key)
    : names.find((n) => n !== n.toLowerCase()) ?? names[0] ?? key;

/**
 * Skills stored under keys that now fold together ("open-source" and
 * "open source"), or under an old key or a worse name: per skill, the row
 * kept (the one already at the key, else the oldest), its key and name, and
 * the rows folded into it. Skills already right are left out.
 */
export const mergePlan = (skills: ReadonlyArray<Skill>): Merge[] => {
  const groups = new Map<string, Skill[]>();
  for (const s of [...skills].sort((a, b) => a.id - b.id)) {
    const key = skillKey(s.key);
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  return [...groups].flatMap(([key, group]): Merge[] => {
    const keep = group.find((s) => s.key === key) ?? group[0];
    if (!keep) return [];
    const others = group.filter((s) => s !== keep);
    const name = bestName(key, [keep.name, ...others.map((s) => s.name)]);
    if (others.length === 0 && keep.key === key && keep.name === name)
      return [];
    return [{ keep: keep.id, key, name, drop: others.map((s) => s.id) }];
  });
};

const Row = Schema.Struct({
  id: Schema.Number,
  key: Schema.String,
  name: Schema.String,
});
const Insight = Schema.Struct({
  resume_key: Schema.String,
  strengths: Schema.Unknown,
});
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/**
 * Folds the stored skills together as `skillKey` now reads them, and names
 * each as `skillName` does: evidence, requirements, plan steps, aliases
 * and strengths move to the skill kept (the strongest evidence, and
 * "required" over "nice", where both had one). Idempotent; the jobs
 * pipeline runs it before reading roles, so role families are summed up
 * from merged skills after it.
 */
export const mergeSkills = Effect.fn('SkillCatalog.merge')(function* () {
  const sql = yield* SqlClient.SqlClient;
  const all = yield* sql`SELECT id, key, name FROM app.skills`.pipe(
    Effect.flatMap(rows(Row))
  );
  const merges = mergePlan(all);
  if (merges.length === 0) return { merged: 0, renamed: 0 };

  const fold = (m: Merge) =>
    Effect.gen(function* () {
      const drop = sql.in([...m.drop]);
      yield* sql`
        INSERT INTO app.resume_evidence (resume_key, entry, skill_id, strength, last_year, quote)
        SELECT DISTINCT ON (resume_key, entry) resume_key, entry, ${m.keep}::int,
               strength, last_year, quote
        FROM app.resume_evidence WHERE skill_id IN ${drop}
        ORDER BY resume_key, entry, strength DESC
        ON CONFLICT (resume_key, entry, skill_id) DO UPDATE SET
          strength = EXCLUDED.strength, last_year = EXCLUDED.last_year,
          quote = EXCLUDED.quote
        WHERE EXCLUDED.strength > app.resume_evidence.strength
      `;
      yield* sql`
        INSERT INTO app.job_requirements (job_id, idx, skill_id, need, years)
        SELECT DISTINCT ON (job_id, idx) job_id, idx, ${m.keep}::int, need, years
        FROM app.job_requirements WHERE skill_id IN ${drop}
        ORDER BY job_id, idx, (need = 'required') DESC
        ON CONFLICT (job_id, idx, skill_id) DO UPDATE SET need = 'required'
        WHERE EXCLUDED.need = 'required'
      `;
      yield* sql`UPDATE app.plan_steps SET skill_id = ${m.keep} WHERE skill_id IN ${drop}`;
      yield* sql`UPDATE app.skill_aliases SET skill_id = ${m.keep} WHERE skill_id IN ${drop}`;
      yield* sql`DELETE FROM app.skills WHERE id IN ${drop}`;
    });

  // Strengths keep their skills' ids in JSON: point them at the kept skills.
  const moved = new Map(merges.flatMap((m) => m.drop.map((d) => [d, m.keep])));
  const restrength = Effect.gen(function* () {
    const insights = yield* sql`
      SELECT resume_key, strengths FROM app.resume_insights
    `.pipe(Effect.flatMap(rows(Insight)));
    for (const row of insights) {
      const read = decodeRead(row.strengths);
      if (Option.isNone(read)) continue;
      const themes = read.value.themes.map((t) => ({
        ...t,
        skills: [...new Set(t.skills.map((id) => moved.get(id) ?? id))],
      }));
      if (!read.value.themes.some((t) => t.skills.some((id) => moved.has(id))))
        continue;
      yield* sql`
        UPDATE app.resume_insights SET strengths = ${JSON.stringify({
          ...read.value,
          themes,
        })}::jsonb WHERE resume_key = ${row.resume_key}
      `;
    }
  });

  yield* Effect.gen(function* () {
    for (const m of merges) {
      if (m.drop.length > 0) yield* fold(m);
      yield* sql`UPDATE app.skills SET key = ${m.key}, name = ${m.name} WHERE id = ${m.keep}`;
      yield* sql`
        INSERT INTO app.skill_aliases (alias, skill_id) VALUES (${m.key}, ${m.keep})
        ON CONFLICT (alias) DO UPDATE SET skill_id = EXCLUDED.skill_id
      `;
    }
    if (moved.size > 0) yield* restrength;
  }).pipe(sql.withTransaction);

  return {
    merged: moved.size,
    renamed: merges.filter((m) => m.drop.length === 0).length,
  };
}, Effect.orDie);
