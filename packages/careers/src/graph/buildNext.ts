import type { Draft } from './draft';
import { seniorityLevel, type GraphInputs } from './inputs';
import type { buildOpen } from './buildOpen';
import type { buildYou } from './buildYou';

const SENIORITY_WORDS: Record<string, string> = {
  intern: 'intern',
  junior: 'junior',
  mid: 'mid-level',
  senior: 'senior',
  staff_plus: 'staff or principal',
  lead_management: 'lead',
};

/**
 * What's next: where people in your current role went (resting on that
 * role and on the kind of role it is), and your plan's steps (resting on
 * the skill each builds, holding up the job or destination it leads to).
 */
export const buildNext = (
  g: Draft,
  input: GraphInputs,
  you: ReturnType<typeof buildYou>,
  open: ReturnType<typeof buildOpen>
) => {
  const { entryNode, have, time } = you;
  const current = input.insight.entries.find(
    (e) => e.section === 'work' && e.endYear === null && e.family
  );
  const from = current ? entryNode.get(current.key) : undefined;

  for (const d of input.destinations) {
    const node = g.add({
      id: `destination:${d.family}:${d.seniority}`,
      kind: 'destination',
      label: `${d.name}${
        SENIORITY_WORDS[d.seniority] ? ` (${SENIORITY_WORDS[d.seniority]})` : ''
      }`,
      detail: `${Math.round(
        d.share
      )}% of people in your role moved here next (${
        d.people === 1 ? 'one person' : `${d.people} people`
      })${
        d.medianYears ? `, after about ${Math.round(d.medianYears)} years` : ''
      }`,
      tone: 'open',
      levels: {
        meaning: 6,
        distance: 5,
        seniority: seniorityLevel(d.seniority),
        time: time.last + 2,
      },
      score: Math.round(d.share),
    });
    g.link(
      from,
      node,
      Math.min(1, d.share / 50),
      'Where people in your role went next'
    );
    g.link(g.at(`direction:${d.family}`), node, 0.6);
  }

  for (const step of input.plan?.steps ?? []) {
    const node = g.add({
      id: `step:${step.id}`,
      kind: 'step',
      label: step.title,
      detail: step.detail,
      tone: step.done ? 'success' : 'active',
      levels: { meaning: 2, distance: 1, time: time.last + 1 },
      jobId: step.jobId,
    });
    if (step.skillId !== null) {
      g.link(open.gaps.get(step.skillId) ?? have.get(step.skillId), node, 1);
    }
    if (step.jobId !== null) g.link(node, g.at(`job:${step.jobId}`), 1);
    const family = input.plan?.family;
    if (family) {
      for (const d of input.destinations.filter((x) => x.family === family)) {
        g.link(node, g.at(`destination:${d.family}:${d.seniority}`), 0.8);
      }
    }
  }
};
