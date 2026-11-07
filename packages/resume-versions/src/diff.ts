import { Predicate } from 'effect';

export type ChangeKind = 'added' | 'removed' | 'changed';

/** One difference between two resumes, at a path like `work[0].highlights`. */
export interface Change {
  path: string;
  kind: ChangeKind;
}

type JsonObject = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonObject =>
  Predicate.isObject(value) && !Array.isArray(value);

/** Arrays of plain values (highlights, keywords) change as one field. */
const isLeafArray = (value: ReadonlyArray<unknown>) =>
  value.every((item) => !Predicate.isObject(item));

/** The same JSON, whatever the order of object keys. */
export const sameJson = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((x, i) => sameJson(x, b[i]));
  if (isRecord(a) && isRecord(b)) {
    const keys = Object.keys(a).filter((k) => a[k] !== undefined);
    const other = Object.keys(b).filter((k) => b[k] !== undefined);
    return (
      keys.length === other.length && keys.every((k) => sameJson(a[k], b[k]))
    );
  }
  return false;
};

const join = (path: string, key: string | number) =>
  typeof key === 'number'
    ? `${path}[${key}]`
    : path === ''
    ? key
    : `${path}.${key}`;

/**
 * What changed from one resume to the next, field by field: objects and
 * lists of entries are followed down, everything else is compared whole.
 * Anything that isn't an object counts as an empty resume.
 */
export const diffResumes = (before: unknown, after: unknown): Change[] => {
  const changes: Change[] = [];
  const walk = (a: unknown, b: unknown, path: string): void => {
    if (sameJson(a, b)) return;
    if (a === undefined) return void changes.push({ path, kind: 'added' });
    if (b === undefined) return void changes.push({ path, kind: 'removed' });
    if (isRecord(a) && isRecord(b)) {
      const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
      for (const key of keys) walk(a[key], b[key], join(path, key));
      return;
    }
    if (
      Array.isArray(a) &&
      Array.isArray(b) &&
      !(isLeafArray(a) && isLeafArray(b))
    ) {
      for (let i = 0; i < Math.max(a.length, b.length); i++)
        walk(a[i], b[i], join(path, i));
      return;
    }
    changes.push({ path, kind: 'changed' });
  };
  walk(isRecord(before) ? before : {}, isRecord(after) ? after : {}, '');
  return changes;
};
