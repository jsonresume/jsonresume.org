import type { JobDecision, Verdict } from '@repo/api';
import { appeal } from './appeal';
import { chance } from './chance';
import { screen } from './screen';
import type { DecisionInput } from './types';

/** Bump when the model changes: stored decisions say which made them. */
export const DECISION_MODEL = 'decide-2';

/**
 * The expected value of applying: how much they'd want it, discounted by
 * the chance they'd get it. A long shot still counts for half: measured on
 * past decisions, chance times appeal let a noisy chance swamp what people
 * want (docs/jobs-ranking/DECISIONS-REPLAY-2026-11.md).
 */
export const expectedValue = (chance: number, appeal: number) =>
  appeal * (0.5 + 0.5 * chance);

/** Where the verdicts begin: measured against past decisions (docs/jobs-ranking). */
export const THRESHOLDS = {
  /** Apply: a good chance at a job they'd want. */
  applyChance: 0.62,
  applyAppeal: 0.45,
  /** Stretch: a job they'd want, within reach. */
  stretchChance: 0.35,
  stretchAppeal: 0.5,
};

const REASONS = 5;

/**
 * The decision on one job: ruled out by a dealbreaker, or ranked by the
 * expected value of applying (chance times appeal) and named apply,
 * stretch or skip; with the reasons that decided it, strongest first.
 */
export const decide = (input: DecisionInput): JobDecision => {
  const out = screen(input);
  const c = chance(input);
  const a = appeal(input);
  const t = THRESHOLDS;
  const verdict: Verdict = out
    ? 'ruled_out'
    : c.value >= t.applyChance && a.value >= t.applyAppeal
    ? 'apply'
    : c.value >= t.stretchChance && a.value >= t.stretchAppeal
    ? 'stretch'
    : 'skip';
  const reasons = [...c.reasons, ...a.reasons]
    .sort((x, y) => y.weight - x.weight)
    .slice(0, out ? REASONS - 1 : REASONS);
  return {
    verdict,
    chance: Math.round(c.value * 100),
    appeal: Math.round(a.value * 100),
    value: Math.round(expectedValue(c.value, a.value) * 100),
    reasons: [...(out ? [out] : []), ...reasons].map(
      ({ weight: _, ...r }) => r
    ),
    shown: c.shown,
    missing: c.missing,
    sectors: input.facts.sectors,
    stage: input.facts.stage,
  };
};

const ORDER: Record<Verdict, number> = {
  apply: 0,
  stretch: 1,
  skip: 2,
  ruled_out: 3,
};

/** Best first: by verdict, then by expected value. */
export const byDecision = (
  a: { decision: JobDecision },
  b: { decision: JobDecision }
) =>
  ORDER[a.decision.verdict] - ORDER[b.decision.verdict] ||
  b.decision.value - a.decision.value;
