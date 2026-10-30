import { JsonResumeApi, NoResume, PlanNotFound } from '@repo/api';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** The signed-in user's career graph, moves and plans (wired in as @repo/careers lands). */
export const CareerHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'career',
  (handlers) =>
    Effect.succeed(
      handlers.handleAll({
        graph: () => Effect.fail(new NoResume()),
        snapshot: () => Effect.fail(new PlanNotFound()),
        moves: () => Effect.fail(new NoResume()),
        plans: () => Effect.succeed([]),
        createPlan: () => Effect.fail(new NoResume()),
        setStep: () => Effect.fail(new PlanNotFound()),
        deletePlan: () => Effect.fail(new PlanNotFound()),
      })
    )
);
