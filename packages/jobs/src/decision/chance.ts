import { fitScore } from '../ranking';
import {
  clamp,
  levelGap,
  listText,
  type DecisionInput,
  type Need,
  type Shown,
  type Weighed,
} from './types';

/** Credit for one requirement: shown with depth, mentioned, or missing; short on years. */
const credit = (need: Need, shown: Shown | undefined) => {
  if (!shown) return 0;
  const depth = shown.weight >= 0.5 ? 1 : 0.6;
  const years =
    need.years !== null && need.years > 0 && shown.years < need.years
      ? Math.max(0.5, shown.years / need.years)
      : 1;
  return depth * years;
};

export interface Coverage {
  /** 0 to 1: how much of what's required the resume shows. */
  value: number;
  required: number;
  shown: ReadonlyArray<string>;
  missing: ReadonlyArray<string>;
  short: ReadonlyArray<string>;
}

/** How much of what the role requires the resume shows; null when nothing is known. */
export const coverage = (
  needs: ReadonlyArray<Need> | null,
  have: ReadonlyMap<string, Shown>
): Coverage | null => {
  const required = (needs ?? []).filter((n) => n.need === 'required');
  if (required.length === 0) return null;
  const credits = required.map((n) => ({ n, c: credit(n, have.get(n.key)) }));
  const nice = (needs ?? []).filter(
    (n) => n.need === 'nice' && have.has(n.key)
  ).length;
  const base = credits.reduce((sum, { c }) => sum + c, 0) / required.length;
  return {
    value: clamp(base + Math.min(0.1, nice * 0.05)),
    required: required.length,
    shown: credits.filter(({ c }) => c > 0).map(({ n }) => n.name),
    missing: credits.filter(({ c }) => c === 0).map(({ n }) => n.name),
    short: credits
      .filter(({ c, n }) => c > 0 && c < 0.6 && n.years !== null)
      .map(({ n }) => `${n.name} (${n.years}+ years)`),
  };
};

/** How much a level gap leaves of the chance: a step up halves it, two more. */
const levelFactor = (gap: number) =>
  gap >= 2 ? 0.45 : gap === 1 ? 0.75 : gap <= -2 ? 0.9 : 1;

const levelWords: Record<number, string> = {
  1: 'A level above yours',
  2: 'Two levels above yours',
};

/**
 * How likely they'd get it, 0 to 1: the model's reading of the post against
 * the resume, and how much of what's required the resume shows (with depth
 * and years), weighed together; then the level gap.
 */
export const chance = (input: DecisionInput) => {
  const cover = coverage(input.needs, input.have);
  const fit = input.fit !== null ? input.fit / 100 : null;
  const parts =
    fit !== null && cover
      ? 0.55 * fit + 0.45 * cover.value
      : fit ?? cover?.value ?? fitScore(input.cosine) / 100;
  const gap = levelGap(input.posting.seniority, input.level);
  const value = clamp(parts * levelFactor(gap));

  const reasons: Weighed[] = [];
  if (cover) {
    const n = cover.shown.length;
    // The tone follows the count it states; depth counts in the chance.
    const share = n / cover.required;
    reasons.push({
      factor: 'skills',
      tone: share >= 0.75 ? 'good' : share < 0.5 ? 'bad' : 'note',
      text:
        n === cover.required
          ? `You show all ${cover.required} required skills`
          : `You show ${n} of ${cover.required} required skills`,
      weight: Math.abs(cover.value - 0.5) + 0.2,
    });
    if (cover.missing.length > 0) {
      reasons.push({
        factor: 'skills',
        tone: 'bad',
        text: `Missing ${listText(cover.missing.slice(0, 3))}${
          cover.missing.length > 3
            ? ` and ${cover.missing.length - 3} more`
            : ''
        }`,
        weight: 0.25 + 0.1 * Math.min(3, cover.missing.length),
      });
    }
    if (cover.short.length > 0) {
      reasons.push({
        factor: 'skills',
        tone: 'note',
        text: `Asks for ${listText(cover.short.slice(0, 2))}`,
        weight: 0.2,
      });
    }
  }
  if (gap >= 1) {
    reasons.push({
      factor: 'level',
      tone: 'bad',
      text: levelWords[gap] ?? 'Well above your level',
      weight: gap >= 2 ? 0.6 : 0.35,
    });
  }
  return {
    value,
    reasons,
    shown: cover?.shown ?? [],
    missing: cover?.missing ?? [],
  };
};
