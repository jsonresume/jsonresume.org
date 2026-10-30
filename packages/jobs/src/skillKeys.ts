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

/** Kinds of work, not skills: posts and resumes use them as both. */
const CATEGORIES = new Set([
  'apis',
  'api',
  'backend',
  'back-end',
  'frontend',
  'front-end',
  'full-stack',
  'fullstack',
  'full stack',
  'devops',
  'ai',
  'infrastructure',
  'databases',
  'web',
  'mobile',
  'cloud',
  'product',
  'design',
  'engineering',
  'software engineering',
]);

/** Whether a name is a skill, not a kind of work ("Backend", "APIs"). */
export const isSkill = (key: string) => !CATEGORIES.has(key);

/**
 * The resume's skills, by key, with the name it writes: each keyword, or
 * the skill's name when it lists none ("Backend: Go, Rust" is Go and Rust).
 */
export const resumeSkillNames = (resume: unknown): Map<string, string> => {
  const names = new Map<string, string>();
  for (const skill of list(at(resume, 'skills'))) {
    const keywords = list(at(skill, 'keywords')).map(str).filter(Boolean);
    for (const name of keywords.length > 0
      ? keywords
      : [str(at(skill, 'name'))]) {
      // "HTML / CSS" is two skills.
      for (const part of name.split(/\s+\/\s+|,\s*/)) {
        if (part && part.length <= 40 && isSkill(skillKey(part)))
          names.set(skillKey(part), part);
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
