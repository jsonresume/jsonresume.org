import { Accounts } from '@repo/accounts';
import { CurrentUser, JsonResumeApi } from '@repo/api';
import { CareerGraphs } from '@repo/careers';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** The signed-in user's career graph (and past months'), moves and plans. */
export const CareerHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'career',
  (handlers) =>
    Effect.gen(function* () {
      const careers = yield* CareerGraphs;
      const accounts = yield* Accounts;
      const mine = Effect.gen(function* () {
        const user = yield* CurrentUser;
        const { resume } = yield* accounts.currentResume(user.id);
        return { user, resume };
      });
      return handlers.handleAll({
        graph: () =>
          Effect.flatMap(mine, ({ user, resume }) =>
            careers.graph(user.id, resume)
          ),
        snapshot: ({ params }) =>
          Effect.flatMap(CurrentUser, (user) =>
            careers.snapshot(user.id, params.month)
          ),
        moves: () =>
          Effect.flatMap(mine, ({ resume }) => careers.moves(resume)),
        plans: () =>
          Effect.flatMap(CurrentUser, (user) => careers.plans(user.id)),
        createPlan: ({ payload }) =>
          Effect.flatMap(mine, ({ user, resume }) =>
            careers.createPlan(user.id, resume, payload.destination)
          ),
        setStep: ({ params, payload }) =>
          Effect.flatMap(CurrentUser, (user) =>
            careers.setStep(user.id, params.planId, params.stepId, payload.done)
          ),
        deletePlan: ({ params }) =>
          Effect.flatMap(CurrentUser, (user) =>
            careers.deletePlan(user.id, params.planId)
          ),
      });
    })
);
