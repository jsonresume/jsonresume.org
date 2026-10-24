import { Accounts } from '@repo/accounts';
import { CurrentUser, JobNotFound, JsonResumeApi } from '@repo/api';
import { JobBoard, JobMatcher } from '@repo/jobs';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** The job board: open to everyone. */
export const JobsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'jobs',
  (handlers) =>
    Effect.gen(function* () {
      const board = yield* JobBoard;
      return handlers.handleAll({
        board: () => board.board,
        status: () => board.status,
        job: ({ params }) => board.job(params.id),
      });
    })
);

/** Jobs ranked against the signed-in user's resume, and their marks. */
export const MyJobsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'myJobs',
  (handlers) =>
    Effect.gen(function* () {
      const matcher = yield* JobMatcher;
      const accounts = yield* Accounts;
      return handlers.handleAll({
        matches: () =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const { resume } = yield* accounts.currentResume(user.id);
            return yield* matcher.matches(user.id, resume);
          }),
        mark: ({ params, payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            if (!(yield* matcher.exists(params.id))) {
              return yield* new JobNotFound();
            }
            yield* matcher.mark(user.id, params.id, payload.mark);
          }),
      });
    })
);
