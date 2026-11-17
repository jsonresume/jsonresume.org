import {
  sectorLabels,
  stageLabels,
  workplaceLabels,
  type Priority,
} from '@repo/api';
import { listText, usd, type DecisionInput, type Weighed } from './types';

/** One thing that makes a job more or less appealing, weighed by a priority. */
export interface Contribution {
  amount: number;
  reason: Omit<Weighed, 'weight'> | null;
  priority?: Priority;
}

export const add = (
  amount: number,
  reason: Contribution['reason'],
  priority?: Priority
): Contribution => ({ amount, reason, ...(priority && { priority }) });

const asWorkplace = {
  remote_global: 'remote_global',
  remote_region: 'remote_region',
  hybrid: 'hybrid',
  onsite: 'onsite',
} as const;

/** Pay against their target (or floor); unstated pay is a note when pay comes first. */
export const pay = ({ posting: p, preferences: want }: DecisionInput) => {
  const top = p.salaryMax ?? p.salaryMin;
  if (top !== null && want.payTarget !== null) {
    if (top >= want.payTarget)
      return [
        add(
          0.15,
          {
            factor: 'pay',
            tone: 'good',
            text: `Up to ${usd(top)}, at or above your target`,
          },
          'pay'
        ),
      ];
    if (top < want.payTarget * 0.85)
      return [
        add(
          -0.08,
          {
            factor: 'pay',
            tone: 'bad',
            text: `Up to ${usd(top)}, under your target`,
          },
          'pay'
        ),
      ];
    return [];
  }
  if (top !== null && want.payFloor !== null)
    return [
      add(
        0.05,
        { factor: 'pay', tone: 'good', text: `Up to ${usd(top)}` },
        'pay'
      ),
    ];
  if (top === null && want.priorities[0] === 'pay')
    return [add(0, { factor: 'pay', tone: 'note', text: 'Pay not stated' })];
  return [];
};

/** Their favourite workplace, what they like the company for, and its stage. */
export const company = ({
  posting: p,
  preferences: want,
  facts,
}: DecisionInput) => {
  const found: Contribution[] = [];
  const favourite = want.workplaces[0];
  if (
    favourite &&
    p.remote !== 'unspecified' &&
    asWorkplace[p.remote] === favourite
  )
    found.push(
      add(
        0.08,
        {
          factor: 'place',
          tone: 'good',
          text: `${workplaceLabels[favourite]}, as you'd like`,
        },
        'flexibility'
      )
    );
  const liked = facts.sectors.filter((s) => want.likeSectors.includes(s));
  if (liked.length > 0)
    found.push(
      add(
        0.15,
        {
          factor: 'sector',
          tone: 'good',
          text: listText(liked.map((s) => sectorLabels[s])),
        },
        'mission'
      )
    );
  if (facts.stage !== 'unspecified' && want.stages.includes(facts.stage))
    found.push(
      add(0.07, {
        factor: 'stage',
        tone: 'good',
        text: stageLabels[facts.stage],
      })
    );
  if (
    want.priorities.includes('stability') &&
    ['public', 'bootstrapped', 'growth'].includes(facts.stage)
  )
    found.push(
      add(
        0.05,
        {
          factor: 'stage',
          tone: 'good',
          text: `${stageLabels[facts.stage]}: steadier`,
        },
        'stability'
      )
    );
  return found;
};
