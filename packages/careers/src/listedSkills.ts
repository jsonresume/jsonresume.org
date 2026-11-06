import { Predicate } from 'effect';
import { foldSkill, isSkillKey, skillKey, skillName } from './skillNames';

const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;
const str = (v: unknown) => (Predicate.isString(v) ? v.trim() : '');

/** A skill from the resume's skills section, and the group it is listed in. */
export interface Listed {
  name: string;
  group: string;
}

/**
 * The resume's skills section: each keyword, or the skill's name when it
 * lists none ("Backend: Go, Rust" is Go and Rust); "HTML / CSS" is two.
 */
export const listedSkills = (resume: unknown): Listed[] => {
  const seen = new Map<string, Listed>();
  for (const skill of list(at(resume, 'skills'))) {
    const group = str(at(skill, 'name'));
    const keywords = list(at(skill, 'keywords')).map(str).filter(Boolean);
    for (const name of keywords.length > 0 ? keywords : [group]) {
      for (const part of name.split(/\s+\/\s+|,\s*/)) {
        const key = skillKey(part);
        if (part && isSkillKey(key) && !seen.has(key))
          seen.set(key, { name: part.trim(), group });
      }
    }
  }
  return [...seen.values()];
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Skills named like everyday words ("Go", "Swift", "React"); letters ("C", "R") too. */
const WORDLIKE = new Set([
  'go',
  'rust',
  'swift',
  'dart',
  'elm',
  'ruby',
  'julia',
  'crystal',
  'spring',
  'express',
  'flask',
  'chef',
  'puppet',
  'salt',
  'react',
  'next',
  'node',
  'ember',
]);
const wordlike = (name: string) => {
  const folded = foldSkill(name);
  return folded.length <= 2 || WORDLIKE.has(folded);
};

/**
 * How a sentence names a skill, as written and by its known name ("ML",
 * "Machine Learning"). Most match in any case, as a whole word ("C" is not
 * in "C++"). Word-like ones match only with their capitals, and not inside
 * "Go-to-market" or "R&D".
 */
const naming = (skill: string): RegExp[] =>
  [...new Set([skill.trim(), skillName(skill)])].flatMap((s) =>
    !wordlike(s)
      ? [
          new RegExp(
            `(^|[^\\p{L}\\p{N}+#])${escape(s)}($|[^\\p{L}\\p{N}+#])`,
            'iu'
          ),
        ]
      : s !== s.toLowerCase()
      ? [
          new RegExp(
            `(?<=^|[\\s(,/"“])${escape(s)}(?=$|[\\s,;:)/!?”"]|\\.(\\s|$))`,
            'u'
          ),
        ]
      : []
  );

/** The sentence of `text` that names `skill`, at most 160 characters. */
export const sentenceNaming = (text: string, skill: string) => {
  const patterns = naming(skill);
  const sentence = text
    .split(/(?<=[.!?])\s+|\n+/)
    .find((s) => patterns.some((p) => p.test(s)));
  return sentence === undefined ? undefined : sentence.trim().slice(0, 160);
};
