import { Predicate } from 'effect';

export type Json = Record<string, unknown>;

/**
 * Leaves out what says nothing: nulls, blank text, empty lists and objects
 * left empty by that. Text is trimmed.
 */
export const compact = (value: unknown): unknown => {
  if (value === null || value === undefined) return undefined;
  if (Predicate.isString(value)) {
    const text = value.trim();
    return text === '' ? undefined : text;
  }
  if (Array.isArray(value)) {
    const items = value.map(compact).filter((v) => v !== undefined);
    return items.length === 0 ? undefined : items;
  }
  if (Predicate.isObject(value)) {
    const entries = Object.entries(value)
      .map(([k, v]) => [k, compact(v)] as const)
      .filter(([, v]) => v !== undefined);
    return entries.length === 0 ? undefined : Object.fromEntries(entries);
  }
  return value;
};

/** A compacted resume: always an object, maybe empty. */
export const compactResume = (value: unknown): Json => {
  const out = compact(value);
  return Predicate.isObject(out) && !Array.isArray(out) ? (out as Json) : {};
};

const escape = (key: string | number) =>
  String(key).replace(/~/g, '~0').replace(/\//g, '~1');

/** A path as a JSON pointer (RFC 6901): ["work", 0, "name"] is /work/0/name. */
export const pointer = (path: ReadonlyArray<string | number>) =>
  path.map((k) => `/${escape(k)}`).join('');

/** Every filled field (text, number, true/false), as JSON pointers. */
export const leaves = (value: unknown, path: Array<string | number> = []) => {
  const out: string[] = [];
  const walk = (v: unknown, at: Array<string | number>) => {
    if (Array.isArray(v)) v.forEach((item, i) => walk(item, [...at, i]));
    else if (Predicate.isObject(v))
      for (const [k, child] of Object.entries(v)) walk(child, [...at, k]);
    else if (v !== undefined && v !== null) out.push(pointer(at));
  };
  walk(value, path);
  return out;
};
