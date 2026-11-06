import { Predicate } from 'effect';
import { isSkillKey, skillKey } from './skillNames';

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

/** The sentence of `text` that names `skill` as a whole word, at most 160 characters. */
export const sentenceNaming = (text: string, skill: string) => {
  const word = new RegExp(
    `(^|[^a-z0-9])${escape(skill.toLowerCase())}($|[^a-z0-9])`
  );
  const sentence = text
    .split(/(?<=[.!?])\s+|\n+/)
    .find((s) => word.test(s.toLowerCase()));
  return sentence === undefined ? undefined : sentence.trim().slice(0, 160);
};
