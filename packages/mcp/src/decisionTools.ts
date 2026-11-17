import { Accounts } from '@repo/accounts';
import {
  DecidedJob,
  JobDecisions as Decisions,
  JobPreferenceChange,
  JobPreferences,
  PreferenceSuggestion,
  Verdict,
} from '@repo/api';
import { JobDecisions } from '@repo/careers';
import { PreferenceStore } from '@repo/jobs';
import { track } from '@repo/posthog';
import { Duration, Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';
import { Count, optional } from './params';

export const DecisionToolkit = Toolkit.make(
  Tool.make('decide_jobs', {
    description: describe('decide_jobs'),
    parameters: Schema.Struct({
      verdict: optional(Verdict, 'Only jobs with this verdict'),
      limit: optional(Count, 'At most this many jobs (default 25)'),
    }),
    success: Schema.Struct({
      stated: Schema.Boolean,
      waiting_for: Schema.Array(Schema.String),
      counts: Decisions.fields.counts,
      suggestions: Schema.Array(PreferenceSuggestion),
      total: Schema.Number,
      jobs: Schema.Array(DecidedJob),
    }),
    ...failing,
  }).annotateMerge(hints('decide_jobs')),
  Tool.make('get_job_preferences', {
    description: describe('get_job_preferences'),
    success: JobPreferences,
    ...failing,
  }).annotateMerge(hints('get_job_preferences')),
  Tool.make('set_job_preferences', {
    description: describe('set_job_preferences'),
    parameters: JobPreferenceChange,
    success: JobPreferences,
    ...failing,
  }).annotateMerge(hints('set_job_preferences'))
);

/** Needs Accounts, JobDecisions and PreferenceStore. */
export const DecisionHandlers = DecisionToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    const decisions = yield* JobDecisions;
    const preferences = yield* PreferenceStore;
    return {
      decide_jobs: ({ verdict, limit }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const { resume } = yield* accounts
            .currentResume(user.id)
            .pipe(
              Effect.mapError(() =>
                failWith(
                  'Your resume is empty. Add to it with save_resume first.'
                )
              )
            );
          const result = yield* decisions
            .decisions(user.id, resume, Duration.seconds(40))
            .pipe(
              Effect.mapError(() =>
                failWith(
                  'Your resume is empty. Add to it with save_resume first.'
                )
              )
            );
          const jobs = result.jobs.filter(
            (j) => verdict === undefined || j.decision.verdict === verdict
          );
          return {
            stated: result.stated,
            waiting_for: result.waitingFor,
            counts: result.counts,
            suggestions: result.suggestions,
            total: jobs.length,
            jobs: jobs.slice(0, Math.max(1, Math.min(100, limit ?? 25))),
          };
        }),
      get_job_preferences: () =>
        Effect.flatMap(caller, (user) => preferences.get(user.id)),
      set_job_preferences: (change) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const current = yield* preferences.get(user.id);
          const saved = yield* preferences.save(
            user.id,
            { ...current, ...change },
            'agent'
          );
          yield* track(user.id, 'job_preferences_saved', {
            source: 'agent',
            fields: Object.keys(change).join(','),
          });
          return saved;
        }),
    };
  })
);
