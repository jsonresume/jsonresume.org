import { Accounts } from '@repo/accounts';
import { CareerMove, PathwayPlan } from '@repo/api';
import { CareerGraphs, graphDigest } from '@repo/careers';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';

const Job = Schema.Struct({
  id: Schema.Number,
  company: Schema.String,
  detail: Schema.String,
  fit: Schema.Number,
  missing: Schema.Array(Schema.String),
});
const PlanId = Schema.String.annotate({ description: 'The plan’s id' });

export const TreeToolkit = Toolkit.make(
  Tool.make('get_career_tree', {
    description: describe('get_career_tree'),
    success: Schema.Struct({
      strengths: Schema.Array(Schema.String),
      ready: Schema.Array(Job),
      oneStep: Schema.Array(Job),
      further: Schema.Number,
      gaps: Schema.Array(
        Schema.Struct({ skill: Schema.String, jobs: Schema.Number })
      ),
      destinations: Schema.Array(
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          detail: Schema.String,
        })
      ),
      plan: Schema.NullOr(
        Schema.Struct({
          id: Schema.String,
          steps: Schema.Array(
            Schema.Struct({ title: Schema.String, done: Schema.Boolean })
          ),
        })
      ),
      pending: Schema.Boolean,
    }),
    ...failing,
  }).annotateMerge(hints('get_career_tree')),
  Tool.make('get_career_moves', {
    description: describe('get_career_moves'),
    success: Schema.Struct({ moves: Schema.Array(CareerMove) }),
    ...failing,
  }).annotateMerge(hints('get_career_moves')),
  Tool.make('list_pathway_plans', {
    description: describe('list_pathway_plans'),
    success: Schema.Struct({ plans: Schema.Array(PathwayPlan) }),
    ...failing,
  }).annotateMerge(hints('list_pathway_plans')),
  Tool.make('create_pathway_plan', {
    description: describe('create_pathway_plan'),
    parameters: Schema.Struct({
      destination: Schema.String.annotate({
        description:
          'A destination id from get_career_tree, or a role in words',
      }),
    }),
    success: PathwayPlan,
    ...failing,
  }).annotateMerge(hints('create_pathway_plan')),
  Tool.make('set_plan_step', {
    description: describe('set_plan_step'),
    parameters: Schema.Struct({
      plan_id: PlanId,
      step_id: Schema.String,
      done: Schema.Boolean,
    }),
    success: PathwayPlan,
    ...failing,
  }).annotateMerge(hints('set_plan_step')),
  Tool.make('delete_pathway_plan', {
    description: describe('delete_pathway_plan'),
    parameters: Schema.Struct({ plan_id: PlanId }),
    success: Schema.Struct({ deleted: Schema.Boolean }),
    ...failing,
  }).annotateMerge(hints('delete_pathway_plan', true))
);

const noResume = () => failWith('Your resume is empty. Add to it first.');
const noPlan = () => failWith('No such plan; list_pathway_plans lists them.');

/** Needs Accounts and CareerGraphs. */
export const TreeHandlers = TreeToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    const careers = yield* CareerGraphs;
    const mine = Effect.gen(function* () {
      const user = yield* caller;
      const { resume } = yield* accounts.currentResume(user.id);
      return { user, resume };
    });
    return {
      get_career_tree: () =>
        Effect.flatMap(mine, ({ user, resume }) =>
          careers.graph(user.id, resume)
        ).pipe(Effect.map(graphDigest), Effect.mapError(noResume)),
      get_career_moves: () =>
        Effect.flatMap(mine, ({ resume }) => careers.moves(resume)).pipe(
          Effect.map((moves) => ({ moves }))
        ),
      list_pathway_plans: () =>
        Effect.flatMap(caller, (user) => careers.plans(user.id)).pipe(
          Effect.map((plans) => ({
            plans: plans.map(({ stepSkills: _, ...p }) => p),
          }))
        ),
      create_pathway_plan: ({ destination }) =>
        Effect.flatMap(mine, ({ user, resume }) =>
          careers.createPlan(user.id, resume, destination)
        ).pipe(
          Effect.map(({ stepSkills: _, ...p }) => p),
          Effect.mapError(noResume)
        ),
      set_plan_step: ({ plan_id, step_id, done }) =>
        Effect.flatMap(caller, (user) =>
          careers.setStep(user.id, plan_id, step_id, done)
        ).pipe(
          Effect.map(({ stepSkills: _, ...p }) => p),
          Effect.mapError(noPlan)
        ),
      delete_pathway_plan: ({ plan_id }) =>
        Effect.flatMap(caller, (user) =>
          careers.deletePlan(user.id, plan_id)
        ).pipe(Effect.as({ deleted: true }), Effect.mapError(noPlan)),
    };
  })
);
