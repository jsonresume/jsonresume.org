import { isFamily, type Family } from './families';
import type { Reading } from './insightReader';
import { listedSkills, sentenceNaming } from './listedSkills';
import { entryTexts } from './resumeEntries';
import type { ResumeEntry, Strength } from './services';
import { skillKey } from './skillNames';
import type { Seniority } from '@repo/api';

/** Evidence before its skill name is resolved to a skill. */
export interface Found {
  entry: string;
  name: string;
  strength: 1 | 2 | 3;
  lastYear: number | null;
  quote: string;
}

/** The pseudo entry for skills the resume lists but no entry shows. */
export const LISTED = 'skills';

const strength = (n: number): 1 | 2 | 3 => (n >= 3 ? 3 : n <= 1 ? 1 : 2);

/** An entry key as the model wrote it, to the key alone: "work:0: Acme" is work:0. */
export const entryKey = (written: string) =>
  /^\s*([a-z]+:\d+)/.exec(written)?.[1] ?? written.trim();

/** The last year an entry shows its skills: when it ended, or this year while current. */
const lastYear = (e: ResumeEntry | undefined, thisYear: number) =>
  e ? e.endYear ?? (e.startYear !== null ? thisYear : null) : null;

/** What the reader found in each entry it was asked about. */
export const readEvidence = (
  reading: Reading,
  entries: ReadonlyArray<ResumeEntry>,
  thisYear: number
): Found[] => {
  const byKey = new Map(entries.map((e) => [e.key, e]));
  return reading.entries.flatMap((r) => {
    const key = entryKey(r.key);
    const entry = byKey.get(key);
    if (!entry) return [];
    return r.skills
      .filter((s) => s.name.trim() && s.quote.trim())
      .map((s) => ({
        entry: key,
        name: s.name.trim(),
        strength: strength(s.strength),
        lastYear: lastYear(entry, thisYear),
        quote: s.quote.trim().slice(0, 160),
      }));
  });
};

/**
 * The resume's listed skills not already found: where an entry names one,
 * evidence there (its sentence as the quote); else on the skills section.
 */
export const listedEvidence = (
  resume: unknown,
  entries: ReadonlyArray<ResumeEntry>,
  thisYear: number,
  found: ReadonlyArray<Found> = []
): Found[] => {
  const covered = new Set(found.map((f) => skillKey(f.name)));
  const texts = entryTexts(resume);
  const byKey = new Map(entries.map((e) => [e.key, e]));
  return listedSkills(resume).flatMap((skill): Found[] => {
    if (covered.has(skillKey(skill.name))) return [];
    const shown = [...texts.entries()].flatMap(([key, text]): Found[] => {
      const quote = sentenceNaming(text, skill.name);
      return quote && byKey.has(key)
        ? [
            {
              entry: key,
              name: skill.name,
              strength: 1,
              lastYear: lastYear(byKey.get(key), thisYear),
              quote,
            },
          ]
        : [];
    });
    return shown.length > 0
      ? shown
      : [
          {
            entry: LISTED,
            name: skill.name,
            strength: 1,
            lastYear: null,
            quote: skill.group ? `${skill.group}: ${skill.name}` : skill.name,
          },
        ];
  });
};

/** Each entry's role family and seniority, from the reader, when it gave a known family. */
export const readRoles = (reading: Reading) =>
  Object.fromEntries(
    reading.entries.flatMap(
      (r): Array<[string, { family: Family; seniority: Seniority }]> =>
        isFamily(r.family)
          ? [[entryKey(r.key), { family: r.family, seniority: r.seniority }]]
          : []
    )
  );

/** The reader's strengths, with the skills their entries show most (used or more). */
export const readStrengths = (
  reading: Reading,
  evidence: ReadonlyArray<{ entry: string; skillId: number; strength: number }>
): Strength[] =>
  reading.strengths.slice(0, 6).map((s) => {
    const entries = s.entries.map(entryKey);
    const count = new Map<number, number>();
    for (const e of evidence) {
      if (entries.includes(e.entry) && e.strength >= 2)
        count.set(e.skillId, (count.get(e.skillId) ?? 0) + 1);
    }
    return {
      name: s.name.trim(),
      summary: s.summary.trim(),
      entries,
      skills: [...count.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([id]) => id),
    };
  });
