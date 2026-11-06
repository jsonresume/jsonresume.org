import { SKILL_ALIASES } from './skillAliases';

/* One way to compare skill names, shared by job matching and the career
   graph: names fold to a key (case, punctuation and known aliases aside),
   and a key has one name to show. */

const DASHES = /[‐-―−]/g;

/**
 * A name as compared: lower-case, hyphens and underscores between words as
 * spaces, no space around a slash, no brackets or trailing punctuation, and
 * "NodeJS", "Node JS" and "Node.js" all "node.js".
 */
export const foldSkill = (name: string): string =>
  name
    .normalize('NFKC')
    .toLowerCase()
    .replace(DASHES, '-')
    .replace(/[()]/g, ' ')
    .replace(/(\w)[-_]+(?=\w)/g, '$1 ')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s+/g, ' ')
    .replace(/[\s.,;:!]+$/, '')
    .trim()
    .replace(/^([a-z][a-z0-9]+?)[. ]?js$/, '$1.js');

/** Folded name to key, and key to the name shown, from SKILL_ALIASES. */
const KEYS = new Map<string, string>();
const NAMES = new Map<string, string>();
for (const [shown, [key, ...others]] of Object.entries(SKILL_ALIASES)) {
  if (key === undefined) continue;
  NAMES.set(key, shown);
  for (const name of [shown, key, ...others]) KEYS.set(foldSkill(name), key);
}

const keyOf = (name: string) => {
  const folded = foldSkill(name);
  return KEYS.get(folded) ?? folded;
};

/**
 * A skill's key: its folded name, or the key of the skill it is another
 * name for. "Kubernetes (k8s)", naming one skill twice, is that skill.
 */
export const skillKey = (name: string): string => {
  const both = /^(.+?)\s*\(([^()]+)\)\s*$/.exec(name.trim());
  if (both?.[1] && both[2]) {
    const key = keyOf(both[1]);
    if (key === keyOf(both[2])) return key;
  }
  return keyOf(name);
};

/** Whether a key is a skill SKILL_ALIASES knows, and so is never matched by meaning. */
export const isKnownSkill = (key: string) => NAMES.has(key);

/** The name to show for a skill: its known name, else as written ("ML" shows as "Machine Learning"). */
export const skillName = (name: string): string =>
  NAMES.get(skillKey(name)) ?? name.trim().replace(/\s+/g, ' ');
