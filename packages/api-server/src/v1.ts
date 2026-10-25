import { Accounts, RateLimiter } from '@repo/accounts';
import {
  CurrentUser,
  JobMark,
  JsonResumeApi,
  V1BadRequest,
  V1NotFound,
  V1NotYet,
  V1TooMany,
} from '@repo/api';
import { JobBoard, JobMatcher, toV1Job, v1Options, v1Select } from '@repo/jobs';
import { Effect, Predicate, Schema } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { client } from './http';

const notYet = (what: string) =>
  new V1NotYet({
    error: `${what} haven't moved from the registry yet. Ask for them at https://github.com/jsonresume/jsonresume.org/issues`,
  });
const noResume = new V1NotFound({
  error:
    'Your account has no resume yet. Add one at https://jsonresume.org/dashboard/editor',
});
const noJob = new V1NotFound({ error: 'No such job' });

const isMark = Schema.is(JobMark);
/** The registry's states, as marks here ("dismissed" was "not for me"). */
const toMark = (state: string | null): JobMark | null | undefined =>
  state === null || state === ''
    ? null
    : state === 'dismissed'
    ? 'not_interested'
    : isMark(state)
    ? state
    : undefined;

/** /api/v1 with an API key: what the jobs CLI calls. */
export const V1Handlers = HttpApiBuilder.group(
  JsonResumeApi,
  'v1',
  (handlers) =>
    Effect.gen(function* () {
      const accounts = yield* Accounts;
      const matcher = yield* JobMatcher;
      const board = yield* JobBoard;
      const resumeOf = Effect.flatMap(CurrentUser, (user) =>
        accounts.currentResume(user.id)
      );
      return handlers.handleAll({
        me: () =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            return {
              username: user.username,
              resume: (yield* resumeOf).resume,
            };
          }),
        // Saves like the editor: to their gist when it feeds the page.
        saveResume: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            yield* accounts.saveResume(user.id, payload).pipe(
              Effect.mapError(
                (e) =>
                  new V1BadRequest({
                    error:
                      e._tag === 'InvalidResume'
                        ? e.message
                        : e._tag === 'GistPermissionNeeded'
                        ? 'Your resume comes from your gist, and GitHub has not let jsonresume.org write to it. Allow it at https://jsonresume.org/dashboard/resume'
                        : 'GitHub did not answer; try again in a minute.',
                  })
              )
            );
            return { username: user.username, message: 'Resume updated' };
          }),
        jobs: ({ query }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const { resume } = yield* resumeOf;
            const ranked = yield* matcher
              .rank(resume, user.id)
              .pipe(Effect.mapError(() => noResume));
            const jobs = v1Select(ranked, v1Options(query)).map(toV1Job);
            return { jobs, total: jobs.length };
          }),
        job: ({ params }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const { row } = yield* board
              .find(params.id)
              .pipe(Effect.mapError(() => noJob));
            const mark = yield* matcher.markOf(user.id, params.id);
            return toV1Job({ row, cosine: 0, order: 0, score: 0, mark });
          }),
        mark: ({ params, payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const mark = toMark(payload.state);
            if (mark === undefined) {
              return yield* new V1BadRequest({
                error: `Unknown state "${payload.state}": use interested, maybe, applied or not_interested`,
              });
            }
            if (!(yield* matcher.exists(params.id))) return yield* noJob;
            yield* matcher.mark(
              user.id,
              params.id,
              mark,
              payload.feedback ?? null
            );
            return { id: params.id, state: mark };
          }),
        // Dossiers and enrichment were registry extras; accepted, not kept.
        enrich: () => Effect.succeed({ updated: false }),
        dossier: () => Effect.fail(new V1NotFound({ error: 'No dossier' })),
        saveDossier: () => Effect.fail(notYet('Dossiers')),
        searches: () => Effect.succeed({ searches: [] }),
        createSearch: () => Effect.fail(notYet('Saved searches')),
      });
    })
);

/** POST /api/v1/jobs: a resume in the body, ranked without an account. */
export const V1PublicHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'v1Public',
  (handlers) =>
    Effect.gen(function* () {
      const matcher = yield* JobMatcher;
      const limiter = yield* RateLimiter;
      return handlers.handleAll({
        matchResume: ({ payload }) =>
          Effect.gen(function* () {
            const who = yield* client;
            yield* limiter.hit(`v1jobs:${who.address}`, 30, 3600).pipe(
              Effect.mapError(
                (e) =>
                  new V1TooMany({
                    error: `Too many requests; try again in ${e.retryAfterSeconds}s`,
                  })
              )
            );
            const basics = Predicate.isObject(payload.resume)
              ? (payload.resume as Record<string, unknown>).basics
              : undefined;
            const bad = new V1BadRequest({
              error:
                'Request body must include a valid resume with a "basics" section',
            });
            if (!Predicate.isObject(basics)) return yield* bad;
            const ranked = yield* matcher
              .rank(payload.resume)
              .pipe(Effect.mapError(() => bad));
            const options = v1Options(payload, { top: 100, days: 120 });
            const jobs = v1Select(ranked, options).map(toV1Job);
            return { jobs, total: jobs.length };
          }),
      });
    })
);
