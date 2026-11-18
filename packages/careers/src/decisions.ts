import type { DecidedJob, JobDecisions as Decisions, Verdict } from '@repo/api';
import {
  byDecision,
  decide,
  DECISION_MODEL,
  decisionStore,
  isStated,
  JobMatcher,
  PreferenceStore,
  resumeCountry,
  resumeMentions,
  suggestions,
  titleOf,
  toSummary,
  zScores,
  type Ranked,
} from '@repo/jobs';
import { Clock, Context, Duration, Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { needsOf, skillsShown, withMentions } from './decisionInputs';
import { pickRole } from './pickRole';
import { JobRoles, ResumeInsights, type ResumeInsight } from './services';

/** Most jobs of each verdict sent: every apply and stretch, the best of the rest. */
const REST = 40;

/**
 * Decisions on every open job for a person: the jobs ranked against their
 * resume (@repo/jobs), what their resume shows (ResumeInsights), what each
 * job's role requires (JobRoles) and what they want (PreferenceStore), put
 * through the decision model. Needs JobMatcher, ResumeInsights, JobRoles,
 * PreferenceStore and SqlClient.
 */
export class JobDecisions extends Context.Service<
  JobDecisions,
  Effect.Success<typeof make>
>()('@repo/careers/JobDecisions') {
  static readonly layer = Layer.effect(
    JobDecisions,
    Effect.suspend(() => make)
  );
}

/** The decided jobs for ranked ones (pure apart from the role lookup). */
export const decideRanked = Effect.fn('JobDecisions.decideRanked')(function* (
  ranked: ReadonlyArray<Ranked>,
  insight: ResumeInsight,
  resume: unknown,
  preferences: Decisions['preferences'],
  year: number
) {
  const roles = yield* JobRoles;
  const roleMap = yield* roles.rolesOf(ranked.map((r) => r.row.id));
  const haveIds = new Set(insight.evidence.map((e) => e.skill.id));
  const worked = new Set(insight.entries.flatMap((e) => e.family ?? []));
  const needs = ranked.map((r) =>
    needsOf(
      pickRole(roleMap.get(r.row.id) ?? [], r.role, haveIds, worked),
      r.row.posting
    )
  );
  const have = withMentions(
    skillsShown(insight, resume, year),
    needs.flatMap((n) => n ?? []),
    resumeMentions(resume)
  );
  const placed = resumeCountry(resume) !== undefined;
  const toward = preferences.direction
    ? zScores(ranked.map((r) => r.toward ?? 0))
    : null;
  // What marks taught retrieval, against the other jobs: the shift itself
  // is shared by every job, so only how far each moved says anything.
  const lean = ranked.some((r) => r.order !== r.cosine)
    ? zScores(ranked.map((r) => r.order - r.cosine))
    : null;
  return ranked
    .map(
      (r, at): DecidedJob => ({
        ...toSummary(r.row),
        // A post without a title is named by the role in it that fits.
        title: titleOf(r.row.posting) || r.role || 'Open roles',
        score: r.score,
        mark: r.mark,
        role: r.role,
        why: r.why,
        decision: decide({
          posting: r.row.posting,
          facts: r.facts,
          eligible: r.eligible,
          placed,
          fit: r.fit,
          cosine: r.cosine,
          marks: lean ? lean[at] ?? 0 : null,
          needs: needs[at] ?? null,
          have,
          level: insight.level,
          preferences,
          direction: toward ? toward[at] ?? 0 : null,
        }),
      })
    )
    .sort(byDecision);
});

/** Every apply and stretch, the best REST skips and ruled-out jobs, and every marked one. */
const trim = (jobs: ReadonlyArray<DecidedJob>) => {
  const seen = { skip: 0, ruled_out: 0 };
  return jobs.filter((j) => {
    const v = j.decision.verdict;
    if (j.mark !== null || v === 'apply' || v === 'stretch') return true;
    seen[v] += 1;
    return seen[v] <= REST;
  });
};

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const matcher = yield* JobMatcher;
  const insights = yield* ResumeInsights;
  const preferenceStore = yield* PreferenceStore;
  const roles = yield* JobRoles;
  const store = decisionStore(sql);

  /**
   * Decisions for the signed-in user, waiting up to `wait` for model work
   * (the posts judged, the resume read); what isn't ready is decided from
   * embeddings and the resume's listed skills, and named in waitingFor.
   * Final decisions are kept (app.job_decisions), in the background.
   */
  const decisions = Effect.fn('JobDecisions.decisions')(function* (
    userId: string,
    resume: unknown,
    wait: Duration.Input = Duration.seconds(4)
  ) {
    const preferences = yield* preferenceStore.get(userId);
    const [{ ranked, judging }, insight, marked] = yield* Effect.all(
      [
        matcher.rankWithin(resume, userId, {
          wait,
          toward: preferences.direction,
        }),
        insights.insight(resume, { wait }),
        store.markedFacts(userId),
      ],
      { concurrency: 'unbounded' }
    );
    const year = new Date(yield* Clock.currentTimeMillis).getUTCFullYear();
    const jobs = yield* decideRanked(
      ranked,
      insight,
      resume,
      preferences,
      year
    ).pipe(Effect.provideService(JobRoles, roles));
    const waitingFor = [
      ...(judging ? (['jobs'] as const) : []),
      ...(insight.pending ? (['resume'] as const) : []),
    ];
    if (waitingFor.length === 0) {
      yield* Effect.forkDetach(store.keep(userId, DECISION_MODEL, jobs));
    }
    const unmarked = (v: Verdict) =>
      jobs.filter((j) => j.mark === null && j.decision.verdict === v).length;
    const result: Decisions = {
      jobs: trim(jobs),
      counts: {
        apply: unmarked('apply'),
        stretch: unmarked('stretch'),
        skip: unmarked('skip'),
        ruled_out: unmarked('ruled_out'),
      },
      preferences,
      stated: isStated(preferences),
      waitingFor,
      suggestions: suggestions(marked, preferences),
    };
    return result;
  });

  return { decisions };
});
