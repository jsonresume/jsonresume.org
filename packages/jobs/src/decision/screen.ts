import { sectorLabels, type Workplace } from '@repo/api';
import { skillKey } from '../skillNames';
import { listText, usd, type DecisionInput, type Weighed } from './types';

const ruled = (factor: Weighed['factor'], text: string): Weighed => ({
  factor,
  tone: 'bad',
  text,
  weight: 1,
});

const jobPlace: Record<string, string> = {
  onsite: 'In an office',
  hybrid: 'Hybrid',
  remote_region: 'Remote in set regions',
  remote_global: 'Remote, anywhere',
};

const employmentText: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'An internship',
  cofounder: 'A co-founder role',
};

const kindText: Record<string, string> = {
  full_time: 'full-time',
  part_time: 'part-time',
  contract: 'contract',
  internship: 'internship',
  cofounder: 'co-founder',
};

const levelText: Record<string, string> = {
  intern: 'An internship',
  junior: 'A junior role',
  mid: 'A mid-level role',
  senior: 'A senior role',
  staff_plus: 'A staff or principal role',
  lead_management: 'A management role',
};

/** "remote work", "remote work anywhere or an office": what they'd take, in words. */
const wantedPlaces = (ws: ReadonlyArray<Workplace>) => {
  const global = ws.includes('remote_global');
  const region = ws.includes('remote_region');
  const words = [
    ...(global && region ? ['remote work'] : []),
    ...(global && !region ? ['remote work anywhere'] : []),
    ...(region && !global ? ['remote work in your region'] : []),
    ...(ws.includes('hybrid') ? ['hybrid work'] : []),
    ...(ws.includes('onsite') ? ['an office'] : []),
  ];
  return words.join(' or ');
};

/** Whether someone who'd take these workplaces would take this job's. */
const takes = (
  wanted: ReadonlyArray<Workplace>,
  remote: DecisionInput['posting']['remote']
) => {
  if (wanted.length === 0 || remote === 'unspecified') return true;
  const anyRemote =
    wanted.includes('remote_global') || wanted.includes('remote_region');
  switch (remote) {
    case 'remote_global':
    case 'remote_region':
      // Where a region-limited job is open to them is eligibility's call.
      return anyRemote;
    case 'hybrid':
      return wanted.includes('hybrid') || wanted.includes('onsite');
    case 'onsite':
      return wanted.includes('onsite');
  }
};

/**
 * The dealbreakers: anything here rules the job out, whatever else it has.
 * Unknowns pass (a post that doesn't state pay isn't ruled out by a floor).
 */
export const screen = (input: DecisionInput): Weighed | null => {
  const { posting: p, preferences: want, facts } = input;
  if (input.eligible === 'no') {
    return ruled('place', 'Not open to people where you live');
  }
  if (!takes(want.workplaces, p.remote)) {
    return ruled(
      'place',
      `${jobPlace[p.remote]}; you want ${wantedPlaces(want.workplaces)}`
    );
  }
  const top = p.salaryMax ?? p.salaryMin;
  if (want.payFloor !== null && top !== null && top < want.payFloor) {
    return ruled(
      'pay',
      `Pays up to ${usd(top)}; your floor is ${usd(want.payFloor)}`
    );
  }
  if (
    want.employment.length > 0 &&
    p.employmentType !== 'unspecified' &&
    !want.employment.includes(p.employmentType)
  ) {
    return ruled(
      'employment',
      `${employmentText[p.employmentType]}; you want ${listText(
        want.employment.map((e) => kindText[e])
      )} work`
    );
  }
  if (
    want.levels.length > 0 &&
    p.seniority !== 'unspecified' &&
    !want.levels.includes(p.seniority)
  ) {
    return ruled(
      'level',
      `${levelText[p.seniority] ?? 'A level'} isn’t one you’d take`
    );
  }
  if (want.needsVisa && p.visa === 'no') {
    return ruled('visa', 'No visa sponsorship');
  }
  const avoided = facts.sectors.filter((s) => want.avoidSectors.includes(s));
  if (avoided.length > 0) {
    return ruled(
      'sector',
      `${listText(avoided.map((s) => sectorLabels[s]))}, which you avoid`
    );
  }
  const avoid = new Set(want.avoidSkills.map(skillKey));
  const required = input.needs
    ? input.needs.filter((n) => n.need === 'required')
    : p.skills.map((s) => ({ key: skillKey(s.name), name: s.name }));
  const disliked = required.filter((n) => avoid.has(n.key));
  if (disliked.length > 0) {
    const names = listText(disliked.map((n) => n.name));
    return ruled('stack', `Needs ${names}, which you'd rather not use`);
  }
  return null;
};
