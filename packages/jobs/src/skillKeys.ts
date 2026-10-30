import { Predicate } from 'effect';

/** Names one skill goes by, folded to one key. */
const ALIASES: Record<string, string> = {
  postgres: 'postgresql',
  pg: 'postgresql',
  k8s: 'kubernetes',
  js: 'javascript',
  ts: 'typescript',
  node: 'node.js',
  nodejs: 'node.js',
  'react.js': 'react',
  reactjs: 'react',
  'next.js': 'nextjs',
  next: 'nextjs',
  golang: 'go',
  'vue.js': 'vue',
  gcp: 'google cloud platform',
  'google cloud': 'google cloud platform',
  aws: 'amazon web services',
  llm: 'llms',
  'large language models': 'llms',
  'ai/llms': 'llms',
  'machine learning': 'ml',
};

/** A skill's key: lower-case, spaces folded, aliases joined. */
export const skillKey = (name: string): string => {
  const key = name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[()]/g, '')
    .trim();
  return ALIASES[key] ?? key;
};

const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;
const str = (v: unknown) => (Predicate.isString(v) ? v.trim() : '');

/** The resume's skills and keywords, by key, with the name it writes. */
export const resumeSkillNames = (resume: unknown): Map<string, string> => {
  const names = new Map<string, string>();
  for (const skill of list(at(resume, 'skills'))) {
    for (const name of [
      str(at(skill, 'name')),
      ...list(at(skill, 'keywords')).map(str),
    ]) {
      // "HTML / CSS" is two skills.
      for (const part of name.split(/\s+\/\s+|,\s*/)) {
        if (part && part.length <= 40) names.set(skillKey(part), part);
      }
    }
  }
  return names;
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whether text mentions a skill by name, as a whole word. */
export const mentions = (text: string, name: string): boolean =>
  name.length >= 2 &&
  new RegExp(`(^|[^a-z0-9])${escape(name.toLowerCase())}($|[^a-z0-9])`).test(
    text.toLowerCase()
  );
