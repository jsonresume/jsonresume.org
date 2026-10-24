import { Accounts } from '@repo/accounts';
import { Job, JobMark, JobMatch, JobSummary, Seniority } from '@repo/api';
import {
  filterJobs,
  noFilters,
  type JobFilters,
} from '@repo/job-board/filters';
import { JobBoard, JobMatcher, toSummary } from '@repo/jobs';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';

const Filters = {
  query: Schema.optional(Schema.String).annotate({
    description:
      'Words that must each start a word of the title, company, place or skills',
  }),
  where: Schema.optional(
    Schema.Literals(['remote', 'anywhere', 'onsite'])
  ).annotate({
    description:
      'remote (any remote), anywhere (remote worldwide), onsite (office or hybrid)',
  }),
  seniority: Schema.optional(Seniority),
  min_salary: Schema.optional(Schema.Number).annotate({
    description: 'Least yearly pay in USD; jobs that state no pay are left out',
  }),
  limit: Schema.optional(Schema.Number).annotate({
    description: 'How many to return (default 20, at most 100)',
  }),
};

type FilterInput = {
  query?: string | undefined;
  where?: JobFilters['where'] | undefined;
  seniority?: JobFilters['seniority'] | undefined;
  min_salary?: number | undefined;
  limit?: number | undefined;
};

const filtersOf = (i: FilterInput): JobFilters => ({
  ...noFilters,
  query: i.query ?? '',
  where: i.where ?? null,
  seniority: i.seniority && i.seniority !== 'unspecified' ? i.seniority : null,
  minSalary: i.min_salary ?? null,
});
const limitOf = (i: FilterInput) => Math.min(Math.max(i.limit ?? 20, 1), 100);
const jobUrl = (id: number) => `https://jsonresume.org/jobs/${id}`;

const Marked = Schema.Struct({
  job: JobSummary,
  mark: JobMark,
  feedback: Schema.NullOr(Schema.String),
  markedAt: Schema.String,
});

export const JobToolkit = Toolkit.make(
  Tool.make('search_jobs', {
    description: describe('search_jobs'),
    parameters: Schema.Struct(Filters),
    success: Schema.Struct({
      total: Schema.Number,
      jobs: Schema.Array(JobSummary),
    }),
    ...failing,
  }).annotateMerge(hints('search_jobs')),
  Tool.make('match_jobs', {
    description: describe('match_jobs'),
    parameters: Schema.Struct({
      ...Filters,
      include_marked: Schema.optional(Schema.Boolean).annotate({
        description:
          'Also return jobs already marked (default: only unmarked ones)',
      }),
    }),
    success: Schema.Struct({
      total: Schema.Number,
      jobs: Schema.Array(JobMatch),
    }),
    ...failing,
  }).annotateMerge(hints('match_jobs')),
  Tool.make('get_job', {
    description: describe('get_job'),
    parameters: Schema.Struct({ id: Schema.Number }),
    success: Schema.Struct({
      job: Job,
      url: Schema.String,
      mark: Schema.NullOr(JobMark),
    }),
    ...failing,
  }).annotateMerge(hints('get_job')),
  Tool.make('mark_job', {
    description: describe('mark_job'),
    parameters: Schema.Struct({
      id: Schema.Number,
      mark: Schema.NullOr(JobMark),
      note: Schema.optional(Schema.String),
    }),
    success: Schema.Struct({ id: Schema.Number, mark: Schema.NullOr(JobMark) }),
    ...failing,
  }).annotateMerge(hints('mark_job')),
  Tool.make('list_marked_jobs', {
    description: describe('list_marked_jobs'),
    parameters: Schema.Struct({ mark: Schema.optional(JobMark) }),
    success: Schema.Array(Marked),
    ...failing,
  }).annotateMerge(hints('list_marked_jobs'))
);

/** Needs Accounts, JobBoard and JobMatcher. */
export const JobHandlers = JobToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    const board = yield* JobBoard;
    const matcher = yield* JobMatcher;
    return {
      search_jobs: (input) =>
        Effect.map(board.board, ({ jobs }) => {
          const found = filterJobs(jobs, filtersOf(input));
          return { total: found.length, jobs: found.slice(0, limitOf(input)) };
        }),
      match_jobs: (input) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const { resume } = yield* accounts.currentResume(user.id);
          const ranked = yield* matcher
            .rank(resume, user.id)
            .pipe(
              Effect.mapError(() =>
                failWith(
                  'Your resume is empty. Add to it with save_resume first.'
                )
              )
            );
          const matches = ranked
            .filter((r) => input.include_marked || r.mark === null)
            .map((r) => ({
              ...toSummary(r.row),
              score: r.score,
              mark: r.mark,
            }));
          const found = filterJobs(matches, filtersOf(input));
          return { total: found.length, jobs: found.slice(0, limitOf(input)) };
        }),
      get_job: ({ id }) =>
        Effect.gen(function* () {
          const job = yield* board
            .job(id)
            .pipe(Effect.mapError(() => failWith(`No job ${id}.`)));
          const user = yield* Effect.option(caller);
          const mark =
            user._tag === 'Some'
              ? yield* matcher.markOf(user.value.id, id)
              : null;
          return { job, url: jobUrl(id), mark };
        }),
      mark_job: ({ id, mark, note }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          if (!(yield* matcher.exists(id)))
            return yield* failWith(`No job ${id}.`);
          yield* matcher.mark(user.id, id, mark, note ?? null);
          return { id, mark };
        }),
      list_marked_jobs: ({ mark }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const found = yield* matcher.marked(user.id, mark ?? null);
          return found.map((m) => ({
            ...m,
            markedAt: m.markedAt.toISOString(),
          }));
        }),
    };
  })
);
