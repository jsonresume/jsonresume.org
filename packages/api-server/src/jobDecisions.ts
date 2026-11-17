import { Accounts } from '@repo/accounts';
import {
  CurrentUser,
  JsonResumeApi,
  type JobDecisions as Decisions,
  type JobPreferences,
} from '@repo/api';
import { JobDecisions } from '@repo/careers';
import { PreferenceStore } from '@repo/jobs';
import { track } from '@repo/posthog';
import { Clock, Duration, Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** How many of each verdict, for the event. */
const counts = (result: Decisions) => {
  const of = (v: string) =>
    result.jobs.filter((j) => j.decision.verdict === v).length;
  return {
    apply: of('apply'),
    stretch: of('stretch'),
    skip: of('skip'),
    ruled_out: of('ruled_out'),
  };
};

/** Which preferences are set: what the event says, never the values themselves beyond counts. */
const stated = (p: JobPreferences) => ({
  workplaces: p.workplaces.join(',') || null,
  pay_floor: p.payFloor !== null,
  pay_target: p.payTarget !== null,
  employment: p.employment.length,
  levels: p.levels.length,
  avoid_sectors: p.avoidSectors.join(',') || null,
  like_sectors: p.likeSectors.join(',') || null,
  stages: p.stages.length,
  want_skills: p.wantSkills.length,
  avoid_skills: p.avoidSkills.length,
  direction: p.direction.length > 0,
  priorities: p.priorities.join(',') || null,
  needs_visa: p.needsVisa,
});

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
              ...counts(result),
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
              ...stated(saved),
            });
            return saved;
          }),
      });
    })
);
