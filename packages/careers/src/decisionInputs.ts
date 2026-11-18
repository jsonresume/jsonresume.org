import {
  resumeSkills,
  skillChoices,
  skillKey,
  type Need,
  type Posting,
  type Shown,
} from '@repo/jobs';
import { evidenceWeight } from './graph/inputs';
import type {
  JobRole,
  Requirement,
  ResumeEntry,
  ResumeInsight,
  Skill,
} from './services';
import { isSkillKey } from './skillNames';

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
 * read; until then the skills the post names, all as required. Kinds of
 * work ("Backend", "AI") and qualifications ("5+ years") aren't skills to
 * show, as on the Tree.
 */
export const needsOf = (
  role: JobRole | null,
  posting: Posting
): ReadonlyArray<Need> | null => {
  const needs: ReadonlyArray<Need> =
    role && role.requirements.length > 0
      ? role.requirements.map((r) => ({
          key: r.skill.key,
          name: r.skill.name,
          need: r.need,
          years: r.years,
        }))
      : posting.skills.map((s) => ({
          key: skillKey(s.name),
          name: s.name,
          need: 'required' as const,
          years: null,
        }));
  const skills = needs.filter((n) => isSkillKey(n.key));
  return skills.length > 0 ? skills : null;
};

/** How a skill the resume only names in its text counts: as a listed one. */
export const MENTIONED: Shown = { weight: 0.4, years: 0 };

/**
 * What the resume shows, with the skills jobs ask for that its evidence
 * missed but its text names ("LLMs" in "LLM-as-judge"), as mentions.
 */
export const withMentions = (
  have: ReadonlyMap<string, Shown>,
  needs: Iterable<Need>,
  mentions: (name: string) => boolean
): ReadonlyMap<string, Shown> => {
  const out = new Map(have);
  for (const n of needs) {
    const shown =
      out.has(n.key) || skillChoices(n.name).some((k) => out.has(k));
    if (!shown && mentions(n.name)) out.set(n.key, MENTIONED);
  }
  return out;
};

/**
 * Requirements as the resume meets them: one naming several skills
 * ("React/TypeScript") that the resume shows one of becomes that skill,
 * not a gap to close.
 */
export const asShown = (
  requirements: ReadonlyArray<Requirement>,
  have: ReadonlySet<number>,
  byKey: ReadonlyMap<string, Skill>
): ReadonlyArray<Requirement> => {
  const met = requirements.map((r) => {
    if (have.has(r.skill.id)) return r;
    const shown = skillChoices(r.skill.name).flatMap(
      (key) => byKey.get(key) ?? []
    )[0];
    return shown ? { ...r, skill: shown } : r;
  });
  // A skill named twice ("TypeScript", "React/TypeScript") counts once.
  const seen = new Set<number>();
  return met.filter((r) => !seen.has(r.skill.id) && !!seen.add(r.skill.id));
};
