import { skillKey } from '../skillNames';
import { add, type Contribution } from './appealFactors';
import { clamp, levelGap, listText, type DecisionInput } from './types';

/** Skills they want to use, or would rather not, that the job asks for. */
export const stack = (input: DecisionInput) => {
  const { posting: p, preferences: want } = input;
  const asked = new Map([
    ...(input.needs ?? []).map((n) => [n.key, n.name] as const),
    ...p.skills.map((s) => [skillKey(s.name), s.name] as const),
  ]);
  const names = (keys: string[]) => keys.map((k) => asked.get(k) ?? k);
  const found: Contribution[] = [];
  const wanted = want.wantSkills.map(skillKey).filter((k) => asked.has(k));
  if (wanted.length > 0)
    found.push(
      add(
        Math.min(0.15, wanted.length * 0.05),
        {
          factor: 'stack',
          tone: 'good',
          text: `Uses ${listText(names(wanted.slice(0, 3)))}`,
        },
        'stack'
      )
    );
  const avoided = want.avoidSkills.map(skillKey).filter((k) => asked.has(k));
  if (avoided.length > 0)
    found.push(
      add(
        -0.08,
        {
          factor: 'stack',
          tone: 'bad',
          text: `Mentions ${listText(names(avoided.slice(0, 2)))}`,
        },
        'stack'
      )
    );
  return found;
};

/**
 * Where they want to go (a z-score, gently: two standard deviations closer
 * is the most it counts; measured, a stated direction says less than pay),
 * the level, and how like the jobs they saved it is, against the rest.
 */
export const direction = (input: DecisionInput) => {
  const found: Contribution[] = [];
  if (input.direction !== null) {
    const d = clamp(input.direction / 2, -1, 1);
    const text =
      d > 0 ? 'Close to where you want to go' : 'Far from where you want to go';
    found.push(
      add(
        0.1 * d,
        Math.abs(d) > 0.5
          ? { factor: 'direction', tone: d > 0 ? 'good' : 'bad', text }
          : null,
        'growth'
      )
    );
  }
  const gap = levelGap(input.posting.seniority, input.level);
  if (gap <= -1 && input.preferences.levels.length === 0)
    found.push(
      add(-0.12 * Math.min(2, -gap), {
        factor: 'level',
        tone: 'bad',
        text: 'A step down from your level',
      })
    );
  else if (gap === 1)
    found.push(
      add(0.04, { factor: 'level', tone: 'good', text: 'A step up' }, 'growth')
    );
  if (input.marks !== null && Math.abs(input.marks) >= 0.5) {
    // Gently, as direction: two standard deviations is the most it counts.
    const m = clamp(input.marks / 2, -1, 1);
    const text = m > 0 ? 'Like jobs you saved' : 'Like jobs you passed on';
    found.push(
      add(
        0.1 * m,
        Math.abs(m) > 0.5
          ? { factor: 'marks', tone: m > 0 ? 'good' : 'bad', text }
          : null
      )
    );
  }
  return found;
};
