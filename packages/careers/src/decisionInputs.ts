import {
  resumeSkills,
  skillKey,
  type Need,
  type Posting,
  type Shown,
} from '@repo/jobs';
import { evidenceWeight } from './graph/inputs';
import type { JobRole, ResumeEntry, ResumeInsight } from './services';

/** Years an entry covers, current ones to this year. */
const span = (e: ResumeEntry, year: number) =>
  e.startYear === null ? 0 : Math.max(0, (e.endYear ?? year) - e.startYear);

/**
 * The skills a resume shows, by key: the strongest evidence (depth and
 * recency, 0 to 1) and the years of the entries showing it. While the
 * resume is still being read, its listed skills stand in, as mentions.
 */
export const skillsShown = (
  insight: ResumeInsight,
  resume: unknown,
  year: number
): ReadonlyMap<string, Shown> => {
  const entries = new Map(insight.entries.map((e) => [e.key, e]));
  const shown = new Map<string, { weight: number; entries: Set<string> }>();
  for (const ev of insight.evidence) {
    const had = shown.get(ev.skill.key) ?? { weight: 0, entries: new Set() };
    had.weight = Math.max(
      had.weight,
      evidenceWeight(ev.strength, ev.lastYear, year)
    );
    had.entries.add(ev.entry);
    shown.set(ev.skill.key, had);
  }
  const result = new Map<string, Shown>();
  for (const [key, { weight, entries: keys }] of shown) {
    const years = [...keys].reduce((sum, k) => {
      const e = entries.get(k);
      return sum + (e?.section === 'work' ? span(e, year) : 0);
    }, 0);
    result.set(key, { weight, years: Math.min(years, 40) });
  }
  if (insight.evidence.length === 0) {
    for (const key of resumeSkills(resume)) {
      result.set(key, { weight: 0.4, years: 0 });
    }
  }
  return result;
};

/**
 * What a job asks for: the fitting role's requirements once its post is
 * read; until then the skills the post names, all as required.
 */
export const needsOf = (
  role: JobRole | null,
  posting: Posting
): ReadonlyArray<Need> | null => {
  if (role && role.requirements.length > 0) {
    return role.requirements.map((r) => ({
      key: r.skill.key,
      name: r.skill.name,
      need: r.need,
      years: r.years,
    }));
  }
  if (posting.skills.length === 0) return null;
  return posting.skills.map((s) => ({
    key: skillKey(s.name),
    name: s.name,
    need: 'required',
    years: null,
  }));
};
