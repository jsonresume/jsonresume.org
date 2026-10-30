import { Seniority } from '@repo/api';
import { Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { familyName, isFamily, type Family } from './families';
import {
  JobRoles,
  SkillCatalog,
  type Archetype,
  type JobRole,
  type Requirement,
} from './services';

const RoleRow = Schema.Struct({
  job_id: Schema.Number,
  idx: Schema.Number,
  title: Schema.String,
  family: Schema.String,
  seniority: Seniority,
  summary: Schema.String,
});
const RequirementRow = Schema.Struct({
  job_id: Schema.Number,
  idx: Schema.Number,
  need: Schema.Literals(['required', 'nice']),
  years: Schema.NullOr(Schema.Number),
  skill_id: Schema.Number,
  key: Schema.String,
  name: Schema.String,
});
/** app.role_archetypes.skills: the skills its roles ask for most. */
export const ArchetypeSkills = Schema.Array(
  Schema.Struct({ skillId: Schema.Number, share: Schema.Number })
);
const ArchetypeRow = Schema.Struct({
  family: Schema.String,
  name: Schema.String,
  summary: Schema.String,
  skills: ArchetypeSkills,
  roles: Schema.Number,
  pay_p50: Schema.NullOr(Schema.Number),
  remote_share: Schema.Number,
});
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** A stored family that is no longer in FAMILIES reads as "other_tech". */
export const asFamily = (value: string): Family =>
  isFamily(value) ? value : 'other_tech';

/** The roles stored for jobs, and the role families, from Postgres. Needs SkillCatalog. */
export const JobRolesLive = Layer.effect(
  JobRoles,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const catalog = yield* SkillCatalog;

    const rolesOf = Effect.fn('JobRoles.rolesOf')(function* (
      jobIds: ReadonlyArray<number>
    ) {
      const found = new Map<number, JobRole[]>();
      if (jobIds.length === 0) return found;
      const ids = [...new Set(jobIds)];
      const roles = yield* sql`
        SELECT job_id::float8 AS job_id, idx::float8 AS idx, title, family, seniority, summary
        FROM app.job_roles WHERE job_id IN ${sql.in(ids)} ORDER BY job_id, idx
      `.pipe(Effect.flatMap(rows(RoleRow)), Effect.orDie);
      const needs = yield* sql`
        SELECT r.job_id::float8 AS job_id, r.idx::float8 AS idx, r.need,
               r.years::float8 AS years, s.id::float8 AS skill_id, s.key, s.name
        FROM app.job_requirements r JOIN app.skills s ON s.id = r.skill_id
        WHERE r.job_id IN ${sql.in(ids)}
        ORDER BY r.job_id, r.idx, (r.need = 'required') DESC, s.name
      `.pipe(Effect.flatMap(rows(RequirementRow)), Effect.orDie);
      const byRole = new Map<string, Requirement[]>();
      for (const n of needs) {
        const key = `${n.job_id}:${n.idx}`;
        byRole.set(key, [
          ...(byRole.get(key) ?? []),
          {
            skill: { id: n.skill_id, key: n.key, name: n.name },
            need: n.need,
            years: n.years,
          },
        ]);
      }
      for (const r of roles) {
        found.set(r.job_id, [
          ...(found.get(r.job_id) ?? []),
          {
            jobId: r.job_id,
            index: r.idx,
            title: r.title,
            family: asFamily(r.family),
            seniority: r.seniority,
            summary: r.summary,
            requirements: byRole.get(`${r.job_id}:${r.idx}`) ?? [],
          },
        ]);
      }
      return found;
    });

    const archetypes = Effect.gen(function* () {
      const stored = yield* sql`
        SELECT family, name, summary, skills, roles::float8 AS roles,
               pay_p50::float8 AS pay_p50, remote_share::float8 AS remote_share
        FROM app.role_archetypes ORDER BY roles DESC, family
      `.pipe(Effect.flatMap(rows(ArchetypeRow)), Effect.orDie);
      const skills = yield* catalog.byIds([
        ...new Set(stored.flatMap((a) => a.skills.map((s) => s.skillId))),
      ]);
      const byId = new Map(skills.map((s) => [s.id, s]));
      return stored.map(
        (a): Archetype => ({
          family: asFamily(a.family),
          name: a.name || familyName(a.family),
          summary: a.summary,
          skills: a.skills.flatMap((s) => {
            const skill = byId.get(s.skillId);
            return skill ? [{ skill, share: s.share }] : [];
          }),
          roles: a.roles,
          payP50: a.pay_p50,
          remoteShare: a.remote_share,
        })
      );
    }).pipe(Effect.withSpan('JobRoles.archetypes'));

    return JobRoles.of({ rolesOf, archetypes });
  })
);
