import { decodePosting } from '@repo/jobs';
import { Effect, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { familyName } from './families';
import { RoleReader } from './roleReader';
import { openJob } from './openJob';

const Role = Schema.Struct({
  job_id: Schema.Number,
  idx: Schema.Number,
  family: Schema.String,
  title: Schema.String,
  summary: Schema.String,
  parsed: Schema.Unknown,
});
const Need = Schema.Struct({
  job_id: Schema.Number,
  idx: Schema.Number,
  skill_id: Schema.Number,
});
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** Skills an archetype keeps: those the most of its roles ask for. */
const TOP_SKILLS = 12;
const REMOTE = new Set(['remote_region', 'remote_global']);

export const median = (values: ReadonlyArray<number>): number | null => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const value =
    sorted.length % 2 === 1
      ? sorted[mid]
      : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
  return value === undefined ? null : Math.round(value);
};

/**
 * Role families as the open jobs show them: per family, how many open
 * roles, the skills they ask for most (with the share of roles asking),
 * the median pay (annual USD, from the post), how many are remote, and a
 * sentence from the model (a plain count without a RoleReader). Families
 * with no open roles are dropped.
 */
export const refreshArchetypes = Effect.fn('JobRoles.refreshArchetypes')(
  function* () {
    const sql = yield* SqlClient.SqlClient;
    const reader = yield* Effect.serviceOption(RoleReader);
    const roles = yield* sql`
      SELECT r.job_id::float8 AS job_id, r.idx::float8 AS idx, r.family, r.title,
             r.summary, j.parsed
      FROM app.job_roles r JOIN app.jobs j ON j.id = r.job_id
      WHERE ${sql.literal(openJob)}
    `.pipe(Effect.flatMap(rows(Role)), Effect.orDie);
    const needs = yield* sql`
      SELECT q.job_id::float8 AS job_id, q.idx::float8 AS idx, q.skill_id::float8 AS skill_id
      FROM app.job_requirements q JOIN app.jobs j ON j.id = q.job_id
      WHERE ${sql.literal(openJob)}
    `.pipe(Effect.flatMap(rows(Need)), Effect.orDie);
    const skillsOf = new Map<string, number[]>();
    for (const n of needs) {
      const key = `${n.job_id}:${n.idx}`;
      skillsOf.set(key, [...(skillsOf.get(key) ?? []), n.skill_id]);
    }
    const byFamily = new Map<string, (typeof Role.Type)[]>();
    for (const r of roles)
      byFamily.set(r.family, [...(byFamily.get(r.family) ?? []), r]);

    const families = yield* Effect.forEach(
      [...byFamily],
      ([family, members]) =>
        Effect.gen(function* () {
          const asking = new Map<number, number>();
          const pay: number[] = [];
          let remote = 0;
          for (const r of members) {
            for (const id of new Set(skillsOf.get(`${r.job_id}:${r.idx}`)))
              asking.set(id, (asking.get(id) ?? 0) + 1);
            const posting = Option.getOrUndefined(decodePosting(r.parsed));
            const top = posting?.salaryMax ?? posting?.salaryMin ?? null;
            if (top !== null && top > 0) pay.push(top);
            if (posting && REMOTE.has(posting.remote)) remote++;
          }
          const skills = [...asking]
            .sort((a, b) => b[1] - a[1] || a[0] - b[0])
            .slice(0, TOP_SKILLS)
            .map(([skillId, n]) => ({
              skillId,
              share: Math.round((100 * n) / members.length) / 100,
            }));
          const plain = `${members.length} open ${
            members.length === 1 ? 'role' : 'roles'
          }.`;
          const summary = Option.isSome(reader)
            ? yield* reader.value
                .summarize(familyName(family), members)
                .pipe(
                  Effect.catchTag('ReadFailed', () => Effect.succeed(plain))
                )
            : plain;
          return {
            family,
            name: familyName(family),
            summary: summary || plain,
            skills,
            roles: members.length,
            payP50: median(pay),
            remoteShare: Math.round((100 * remote) / members.length),
          };
        }),
      { concurrency: 4 }
    );

    yield* Effect.gen(function* () {
      yield* Effect.forEach(
        families,
        (a) => sql`
          INSERT INTO app.role_archetypes
            (family, name, summary, skills, roles, pay_p50, remote_share, refreshed_at)
          VALUES (${a.family}, ${a.name}, ${a.summary}, ${JSON.stringify(
          a.skills
        )}::jsonb, ${a.roles}, ${a.payP50}, ${a.remoteShare}, now())
          ON CONFLICT (family) DO UPDATE SET name = EXCLUDED.name,
            summary = EXCLUDED.summary, skills = EXCLUDED.skills,
            roles = EXCLUDED.roles, pay_p50 = EXCLUDED.pay_p50,
            remote_share = EXCLUDED.remote_share, refreshed_at = now()
        `,
        { discard: true }
      );
      const kept = families.map((a) => a.family);
      yield* kept.length > 0
        ? sql`DELETE FROM app.role_archetypes WHERE family NOT IN ${sql.in(
            kept
          )}`
        : sql`DELETE FROM app.role_archetypes`;
    }).pipe(sql.withTransaction, Effect.orDie);

    return { families: families.length, roles: roles.length };
  }
);
