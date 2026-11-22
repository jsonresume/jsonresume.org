import { Accounts } from '@repo/accounts';
import { CurrentUser, JsonResumeApi } from '@repo/api';
import { JobDecisions } from '@repo/careers';
import { preferenceSummary, PreferenceStore } from '@repo/jobs';
import { track } from '@repo/posthog';
import { Clock, Duration, Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** Decisions on the open jobs for the signed-in user, and what they want. */
export const JobDecisionsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'jobDecisions',
  (handlers) =>
    Effect.gen(function* () {
      const decisions = yield* JobDecisions;
      const preferences = yield* PreferenceStore;
      const accounts = yield* Accounts;
      return handlers.handleAll({
        decisions: ({ query }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const { resume } = yield* accounts.currentResume(user.id);
            const started = yield* Clock.currentTimeMillis;
            const wait = Math.min(40, Math.max(0, query.wait ?? 4));
            const result = yield* decisions.decisions(
              user.id,
              resume,
              Duration.seconds(wait)
            );
            const ms = (yield* Clock.currentTimeMillis) - started;
            yield* track(user.id, 'jobs_decided', {
              ...result.counts,
              sent: result.jobs.length,
              stated: result.stated,
              suggestions: result.suggestions.length,
              waiting: result.waitingFor.join(',') || null,
              ms,
            });
            return result;
          }),
        preferences: () =>
          Effect.flatMap(CurrentUser, (user) => preferences.get(user.id)),
        savePreferences: ({ payload, query }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const source = query.source ?? 'you';
            const saved = yield* preferences.save(user.id, payload, source);
            yield* track(user.id, 'job_preferences_saved', {
              source,
              ...preferenceSummary(saved),
            });
            return saved;
          }),
      });
    })
);
