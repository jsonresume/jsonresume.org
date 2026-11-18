import { Predicate } from 'effect';
import type { ResumeDocument } from './render.ts';

/* Shapes people write that themes crash on, or drop, read the way the
   schema means them. Found by rendering every hosted resume in its own
   theme (2026-11-18). */

type Entry = Record<string, unknown>;

const SECTIONS = [
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
];

/** The networks people link most, named as they name themselves. */
const NETWORKS: Record<string, string> = {
  github: 'GitHub',
  gitlab: 'GitLab',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  x: 'X',
  stackoverflow: 'Stack Overflow',
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
};

/** A profile's network from its address: "https://github.com/ada" is GitHub. */
const networkOf = (url: unknown): string | undefined => {
  if (!Predicate.isString(url)) return undefined;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const label = host.split('.').slice(-2, -1)[0] ?? host;
    if (!label) return undefined;
    return NETWORKS[label] ?? label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return undefined;
  }
};

/** Profiles with a network (themes read it as a string), from the address if missing; empty ones go. */
const profiles = (list: unknown): Entry[] =>
  (Array.isArray(list) ? list : []).flatMap((p: unknown) => {
    if (!Predicate.isObject(p)) return [];
    const network = p['network'];
    if (Predicate.isString(network) && network.trim()) return [p];
    const named = networkOf(p['url']);
    return named ? [{ ...p, network: named }] : [];
  });

/** A list item as text: an object's text values joined ("Pump: built it"). */
const asText = (item: unknown): string[] => {
  if (Predicate.isString(item)) return [item];
  if (Predicate.isNumber(item)) return [String(item)];
  if (!Predicate.isObject(item)) return [];
  const parts = Object.values(item).filter(Predicate.isString);
  return parts.length > 0 ? [parts.join(': ')] : [];
};

const TEXT_LISTS = ['highlights', 'keywords', 'courses'];

const withTextLists = (entry: unknown): unknown => {
  if (!Predicate.isObject(entry)) return entry;
  const out: Entry = { ...entry };
  for (const key of TEXT_LISTS) {
    const list = out[key];
    if (Array.isArray(list)) out[key] = list.flatMap(asText);
  }
  return out;
};

/**
 * A section as the list themes iterate: skills written as a map of groups
 * ({ backend: [...] }) become groups, references written as one sentence
 * become one reference, a single entry (mostly text) becomes a list of one;
 * anything else that isn't a list renders as nothing.
 */
const asList = (section: string, value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (section === 'skills' && Predicate.isObject(value))
    return Object.entries(value).map(([name, keywords]) => ({
      name,
      keywords: Array.isArray(keywords) ? keywords : [keywords],
    }));
  if (section === 'references' && Predicate.isString(value))
    return [{ name: '', reference: value }];
  // One entry written without its list: mostly text ("name", "summary").
  if (Predicate.isObject(value) && !Array.isArray(value)) {
    const values = Object.values(value);
    const text = values.filter(Predicate.isString).length;
    if (text > 0 && text * 2 >= values.length) return [value];
  }
  return [];
};

/** Every section a list of entries, their text lists text, profiles named, and a name. */
export const withSchemaShapes = (resume: ResumeDocument): ResumeDocument => {
  const out: Entry = { ...resume };
  for (const section of SECTIONS) {
    if (out[section] === undefined || out[section] === null) continue;
    out[section] = asList(section, out[section]).map(withTextLists);
  }
  const basics = Predicate.isObject(out['basics']) ? out['basics'] : {};
  out['basics'] = {
    ...basics,
    name: Predicate.isString(basics['name']) ? basics['name'] : '',
    profiles: profiles(basics['profiles']),
  };
  return out;
};
