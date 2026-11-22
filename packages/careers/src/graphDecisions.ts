import type { JobPreferences } from '@repo/api';
import {
  noPreferences,
  PreferenceStore,
  resumeMentions,
  type Ranked,
} from '@repo/jobs';
import { Effect, Option } from 'effect';
import { decideRanked } from './decisions';
import { gather } from './gather';
import type { ResumeInsight } from './services';

/** What a person wants, or nothing stated where there is no store (tests). */
export const preferencesFor = (
  store: Option.Option<PreferenceStore['Service']>,
  userId: string
): Effect.Effect<JobPreferences> =>
  Option.match(store, {
    onNone: () => Effect.succeed(noPreferences),
    onSome: (s) => s.get(userId),
  });

/**
 * The jobs the Tree draws: those no dealbreaker of theirs rules out, with
 * how much they'd want each (0 to 1), so the gaps that matter are the ones
 * in jobs they'd take. Needs JobRoles.
 */
export const wantedOnly = Effect.fn('Careers.wantedOnly')(function* (
  ranked: ReadonlyArray<Ranked>,
  insight: ResumeInsight,
  resume: unknown,
  preferences: JobPreferences,
  year: number
) {
  const decided = yield* decideRanked(
    ranked,
    insight,
    resume,
    preferences,
    year
  );
  const verdict = new Map(decided.map((d) => [d.id, d.decision.verdict]));
  return {
    ranked: ranked.filter((r) => verdict.get(r.row.id) !== 'ruled_out'),
    appeal: new Map(decided.map((d) => [d.id, d.decision.appeal / 100])),
  };
});

/**
 * The Tree's inputs from the jobs a person would take: ruled-out ones
 * left out, the rest weighed by appeal. Needs what gather needs.
 */
export const gatherWanted = Effect.fn('Careers.gatherWanted')(function* (
  userId: string,
  insight: ResumeInsight,
  ranked: ReadonlyArray<Ranked>,
  on: { resume: unknown; preferences: JobPreferences; year: number }
) {
  const wanted = yield* wantedOnly(
    ranked,
    insight,
    on.resume,
    on.preferences,
    on.year
  );
  return yield* gather(
    userId,
    insight,
    wanted.ranked,
    on.year,
    wanted.appeal,
    resumeMentions(on.resume)
  );
});
