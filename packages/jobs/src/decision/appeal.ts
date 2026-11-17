import type { Priority } from '@repo/api';
import { company, pay } from './appealFactors';
import { direction, stack } from './appealSignals';
import { clamp, type DecisionInput, type Weighed } from './types';

/** What their first, second and third priorities multiply. */
const RANKED = [1.6, 1.3, 1.15];

/**
 * How much they'd want it, 0 to 1, from 0.5: what they said they want
 * (pay, workplace, sectors, stage, skills, direction), what their marks
 * taught (jobs like ones they saved or passed on), and the level, each
 * weighed up by their priorities.
 */
export const appeal = (input: DecisionInput) => {
  const { priorities } = input.preferences;
  const boost = (priority: Priority | undefined) => {
    const at = priority ? priorities.indexOf(priority) : -1;
    return at >= 0 ? RANKED[at] ?? 1 : 1;
  };
  const reasons: Weighed[] = [];
  let value = 0.5;
  for (const c of [
    ...pay(input),
    ...company(input),
    ...stack(input),
    ...direction(input),
  ]) {
    const weighed = c.amount * boost(c.priority);
    value += weighed;
    // A note (pay not stated) weighs nothing but still shows, below the rest.
    if (c.reason)
      reasons.push({ ...c.reason, weight: Math.abs(weighed) || 0.1 });
  }
  return { value: clamp(value), reasons };
};
