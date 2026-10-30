import { PathwayPlan, PlanNotFound, PlanStepKind, Seniority } from '@repo/api';
import { Context, Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import type { Drafted } from './planner';

const PlanRow = Schema.Struct({
  id: Schema.String,
  destination: Schema.String,
  family: Schema.NullOr(Schema.String),
  seniority: Schema.NullOr(Seniority),
  summary: Schema.String,
  created_at: Schema.Date,
});
const StepRow = Schema.Struct({
  id: Schema.String,
  plan_id: Schema.String,
  kind: PlanStepKind,
  title: Schema.String,
  detail: Schema.String,
  skill_id: Schema.NullOr(Schema.Number),
  skill: Schema.NullOr(Schema.String),
  job_id: Schema.NullOr(Schema.Number),
  done_at: Schema.NullOr(Schema.Date),
});
const rows = <S extends Schema.Constraint>(s: S) =>
  Schema.decodeUnknownEffect(Schema.Array(s));

/** A plan with its steps' skill ids, for the graph. */
export interface StoredPlan extends PathwayPlan {
  stepSkills: ReadonlyMap<string, number>;
}

/** Plans people make on Pathways (app.pathway_plans, app.plan_steps), newest first. */
export class PlanStore extends Context.Service<
  PlanStore,
  Effect.Success<typeof make>
>()('@repo/careers/PlanStore') {
  static readonly layer = Layer.effect(
    PlanStore,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  const load = (userId: string, only: string | null) =>
    Effect.gen(function* () {
      const plans = yield* sql`
        SELECT id::text, destination, family, seniority, summary, created_at
        FROM app.pathway_plans WHERE user_id = ${userId}
          AND (${only}::uuid IS NULL OR id = ${only}::uuid)
        ORDER BY created_at DESC
      `.pipe(Effect.flatMap(rows(PlanRow)), Effect.orDie);
      if (plans.length === 0) return [];
      const steps = yield* sql`
        SELECT s.id::text, s.plan_id::text, s.kind, s.title, s.detail, s.skill_id,
               k.name AS skill, s.job_id::float8 AS job_id, s.done_at
        FROM app.plan_steps s LEFT JOIN app.skills k ON k.id = s.skill_id
        WHERE s.plan_id IN ${sql.in(plans.map((p) => p.id))}
        ORDER BY s.position
      `.pipe(Effect.flatMap(rows(StepRow)), Effect.orDie);
      return plans.map((p): StoredPlan => {
        const own = steps.filter((s) => s.plan_id === p.id);
        return {
          id: p.id,
          destination: p.destination,
          family: p.family,
          seniority: p.seniority,
          summary: p.summary,
          createdAt: p.created_at.toISOString(),
          steps: own.map((s) => ({
            id: s.id,
            kind: s.kind,
            title: s.title,
            detail: s.detail,
            skill: s.skill,
            jobId: s.job_id,
            done: s.done_at !== null,
          })),
          stepSkills: new Map(
            own.flatMap((s) =>
              s.skill_id === null ? [] : [[s.id, s.skill_id]]
            )
          ),
        };
      });
    });

  const one = (userId: string, planId: string) =>
    load(
      userId,
      /^[0-9a-f-]{36}$/i.test(planId)
        ? planId
        : '00000000-0000-0000-0000-000000000000'
    ).pipe(
      Effect.flatMap(([p]) =>
        p ? Effect.succeed(p) : Effect.fail(new PlanNotFound())
      )
    );

  /** Saves a drafted plan; skill names and job ids it can't place are left off. */
  const create = (
    userId: string,
    plan: Drafted,
    skills: ReadonlyMap<string, number>,
    jobs: ReadonlySet<number>
  ) =>
    Effect.gen(function* () {
      const [row] = yield* sql<{ id: string }>`
        INSERT INTO app.pathway_plans (user_id, destination, family, seniority, summary)
        VALUES (${userId}, ${plan.destination}, ${plan.family}, ${plan.seniority}, ${plan.summary})
        RETURNING id::text
      `;
      const id = row?.id ?? '';
      yield* Effect.forEach(
        plan.steps,
        (s, position) => sql`
          INSERT INTO app.plan_steps (plan_id, position, kind, title, detail, skill_id, job_id)
          VALUES (${id}, ${position}, ${s.kind}, ${s.title}, ${s.detail},
                  ${skills.get(s.skill) ?? null}, ${
          jobs.has(s.jobId) ? s.jobId : null
        })
        `,
        { discard: true }
      );
      return id;
    }).pipe(
      sql.withTransaction,
      Effect.orDie,
      Effect.flatMap((id) => one(userId, id)),
      Effect.orDie
    );

  const setStep = (
    userId: string,
    planId: string,
    stepId: string,
    done: boolean
  ) =>
    Effect.gen(function* () {
      const plan = yield* one(userId, planId);
      if (!plan.steps.some((s) => s.id === stepId))
        return yield* new PlanNotFound();
      yield* sql`
        UPDATE app.plan_steps SET done_at = ${done ? new Date() : null}
        WHERE id = ${stepId}::uuid AND plan_id = ${plan.id}::uuid
      `.pipe(Effect.orDie);
      yield* sql`UPDATE app.pathway_plans SET updated_at = now() WHERE id = ${plan.id}::uuid`.pipe(
        Effect.orDie
      );
      return yield* one(userId, planId);
    });

  const remove = (userId: string, planId: string) =>
    one(userId, planId).pipe(
      Effect.flatMap((p) =>
        sql`DELETE FROM app.pathway_plans WHERE id = ${p.id}::uuid`.pipe(
          Effect.orDie
        )
      ),
      Effect.asVoid
    );

  return {
    list: (userId: string) => load(userId, null),
    latest: (userId: string) =>
      load(userId, null).pipe(Effect.map((ps) => ps[0] ?? null)),
    create,
    setStep,
    remove,
  };
});
