import type { CareerGraph, CareerMove } from '@repo/api';
import { JobMatcher } from '@repo/jobs';
import { Clock, Context, Effect, Layer, Option } from 'effect';
import { familyName, isFamily, SENIORITY_ORDER } from './families';
import { gather } from './gather';
import { buildGraph } from './graph/build';
import { Planner, plainPlan, type PlanBrief } from './planner';
import { PlanStore } from './plans';
import {
  CareerMoves,
  JobRoles,
  ResumeInsights,
  SkillCatalog,
} from './services';
import { Snapshots } from './snapshots';

/**
 * A signed-in user's career: the graph Pathways draws, where people in
 * their role go next, and plans. Needs ResumeInsights, JobRoles,
 * SkillCatalog, CareerMoves, PlanStore, Snapshots and JobMatcher; a
 * Planner when there is a model.
 */
export class CareerGraphs extends Context.Service<
  CareerGraphs,
  Effect.Success<typeof make>
>()('@repo/careers/CareerGraphs') {
  static readonly layer = Layer.effect(
    CareerGraphs,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const context = Layer.succeedContext(
    yield* Effect.context<
      ResumeInsights | JobRoles | SkillCatalog | CareerMoves | PlanStore
    >()
  );
  const matcher = yield* JobMatcher;
  const plans = yield* PlanStore;
  const snapshots = yield* Snapshots;
  const catalog = yield* SkillCatalog;
  const moves = yield* CareerMoves;
  const insights = yield* ResumeInsights;
  const planner = yield* Effect.serviceOption(Planner);

  const build = (userId: string, resume: unknown) =>
    Effect.gen(function* () {
      const ranked = yield* matcher.rank(resume, userId);
      const now = new Date(yield* Clock.currentTimeMillis);
      const input = yield* gather(
        userId,
        resume,
        ranked,
        now.getUTCFullYear()
      ).pipe(Effect.provide(context));
      return { input, built: buildGraph(input), now };
    });

  /** The graph; this month's is kept once the AI reading is done. */
  const graph = Effect.fn('Careers.graph')(function* (
    userId: string,
    resume: unknown
  ) {
    const { input, built, now } = yield* build(userId, resume);
    const pending = input.insight.pending;
    const whole: CareerGraph = { ...built, pending, snapshots: [] };
    if (!pending) yield* snapshots.keep(userId, whole, now);
    return { ...whole, snapshots: yield* snapshots.months(userId) };
  });

  /** Where people in the resume's current role went next. */
  const movesFor = Effect.fn('Careers.moves')(function* (resume: unknown) {
    const insight = yield* insights.insight(resume);
    const work = insight.entries.filter(
      (e) => e.section === 'work' && e.family
    );
    const current = work.find((e) => e.endYear === null) ?? work[0];
    if (!current?.family || !current.seniority) return [];
    const found = yield* moves.from(current.family, current.seniority);
    return found.map(
      (m): CareerMove => ({
        ...m,
        name: familyName(m.family),
        share: Math.round(m.share),
      })
    );
  });

  /**
   * A plan to `destination`: a destination's id from the graph
   * ("destination:eng_manager:lead_management") or the person's own words.
   */
  const createPlan = Effect.fn('Careers.createPlan')(function* (
    userId: string,
    resume: unknown,
    destination: string
  ) {
    const { input, built } = yield* build(userId, resume);
    const [, family, seniority] = destination.split(':');
    const known =
      destination.startsWith('destination:') && family && isFamily(family);
    const label = known
      ? built.nodes.find((n) => n.id === destination)?.label ??
        familyName(family)
      : destination.trim().slice(0, 120);
    const archetype = known
      ? input.archetypes.find((a) => a.family === family)
      : undefined;
    const brief: PlanBrief = {
      destination: label,
      strengths: input.insight.strengths.map((s) => `${s.name}: ${s.summary}`),
      skills: [...new Set(input.insight.evidence.map((e) => e.skill.name))],
      gaps: built.nodes.filter((n) => n.kind === 'gap').map((n) => n.label),
      asks: archetype?.skills.slice(0, 12).map((s) => s.skill.name) ?? [],
      jobs: input.jobs.slice(0, 15).map((j) => ({
        id: j.ranked.row.id,
        company: j.ranked.row.posting.company,
        title: j.role?.title ?? j.ranked.row.posting.title,
        score: j.ranked.score,
      })),
      history: input.insight.entries
        .filter((e) => e.section === 'work')
        .map(
          (e) =>
            `${e.detail ?? ''} at ${e.label} (${e.startYear ?? '?'}–${
              e.endYear ?? 'now'
            })`
        ),
    };
    const drafted = yield* Option.match(planner, {
      onNone: () => Effect.succeed(plainPlan(brief)),
      onSome: (p) =>
        p.draft(brief).pipe(
          Effect.catchTag('PlanFailed', (e) =>
            Effect.logWarning('Plan drafting failed', {
              error: e.message,
            }).pipe(Effect.as(plainPlan(brief)))
          )
        ),
    });
    const plan = known
      ? {
          ...drafted,
          destination: label,
          family,
          seniority:
            SENIORITY_ORDER.find((s) => s === seniority) ?? drafted.seniority,
        }
      : drafted;
    const named = [...new Set(plan.steps.map((s) => s.skill).filter(Boolean))];
    const skills = named.length > 0 ? yield* catalog.resolve(named) : new Map();
    return yield* plans.create(
      userId,
      { ...plan, family: isFamily(plan.family) ? plan.family : drafted.family },
      new Map([...skills].map(([name, s]) => [name, s.id])),
      new Set(input.jobs.map((j) => j.ranked.row.id))
    );
  });

  return {
    graph,
    moves: movesFor,
    createPlan,
    plans: plans.list,
    setStep: plans.setStep,
    deletePlan: plans.remove,
    snapshot: snapshots.at,
  };
});
