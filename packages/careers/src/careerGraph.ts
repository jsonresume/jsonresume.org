import type { CareerGraph, CareerMove, CareerWait } from '@repo/api';
import { JobMatcher, type RunOptions } from '@repo/jobs';
import { Clock, Context, Duration, Effect, Layer, Option } from 'effect';
import { familyName, isFamily, SENIORITY_ORDER } from './families';
import { gather } from './gather';
import { buildGraph } from './graph/build';
import { planBrief } from './planBrief';
import { Planner, plainPlan } from './planner';
import { PlanStore } from './plans';
import { preparer } from './prepare';
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

/** How long a graph waits for the models by default (they run at once). */
const WAIT = Duration.seconds(40);

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

  // The two model steps (jobs judged against the resume, the resume read)
  // don't need each other, so they run at once, each waiting up to `wait`
  // and joining a run already under way for the same content.
  const models = (userId: string, resume: unknown, options: RunOptions) =>
    Effect.all(
      [
        matcher.rankWithin(resume, userId, options),
        insights.insight(resume, options),
      ],
      { concurrency: 'unbounded' }
    );

  const build = (userId: string, resume: unknown, wait: Duration.Input) =>
    Effect.gen(function* () {
      const [{ ranked, judging }, insight] = yield* models(userId, resume, {
        wait,
      });
      const now = new Date(yield* Clock.currentTimeMillis);
      const input = yield* gather(
        userId,
        insight,
        ranked,
        now.getUTCFullYear()
      ).pipe(Effect.provide(context));
      const waitingFor: CareerWait[] = [
        ...(insight.pending ? (['resume'] as const) : []),
        ...(judging ? (['jobs'] as const) : []),
      ];
      return { input, built: buildGraph(input), now, waitingFor };
    });

  /**
   * The graph, waiting up to `wait` for the models; pending (with what it
   * waits for) when they are still at work. This month's is kept once
   * nothing is pending.
   */
  const graph = Effect.fn('Careers.graph')(function* (
    userId: string,
    resume: unknown,
    wait: Duration.Input = WAIT
  ) {
    const { built, now, waitingFor } = yield* build(userId, resume, wait);
    const pending = waitingFor.length > 0;
    const whole: CareerGraph = { ...built, pending, snapshots: [] };
    if (!pending) yield* snapshots.keep(userId, whole, now);
    return {
      ...whole,
      waitingFor,
      snapshots: yield* snapshots.months(userId),
    };
  });

  /** Starts a version's model work before anyone asks (see preparer). */
  const prepare = preparer((userId, resume, options) =>
    models(userId, resume, options).pipe(
      Effect.catchTag('NoResume', () => Effect.void)
    )
  );

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
    const { input, built } = yield* build(userId, resume, WAIT);
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
    const brief = planBrief(label, input, built, archetype);
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
    prepare,
    moves: movesFor,
    createPlan,
    plans: plans.list,
    setStep: plans.setStep,
    deletePlan: plans.remove,
    snapshot: snapshots.at,
  };
});
