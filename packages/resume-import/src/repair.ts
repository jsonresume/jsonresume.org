import schemaJson from '@jsonresume/schema/schema.json';
import { pathLabel, validate } from '@repo/resume-editor/validate';
import type { JsonSchemaNode } from '@repo/schema-explorer/model';
import { Predicate } from 'effect';
import { compactResume, pointer, type Json } from './clean';
import { isoDate } from './dates';

const schema = schemaJson as JsonSchemaNode;

type Path = ReadonlyArray<string | number>;

/** What repair did: the valid resume, what it left out, what it rewrote. */
export interface Repaired {
  resume: Json;
  warnings: string[];
  /** JSON pointers of fields rewritten to fit the schema (a date, a URL). */
  changed: ReadonlySet<string>;
}

const DOMAIN = /^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?(\/\S*)?$/i;

/** A value rewritten to pass the schema, or undefined when it can't be. */
const fix = (value: string, message: string): string | undefined => {
  if (message.startsWith('Use a date')) return isoDate(value);
  if (message.includes('full URL')) {
    if (/^mailto:/i.test(value)) return undefined;
    return DOMAIN.test(value) ? `https://${value}` : undefined;
  }
  return undefined;
};

const parentOf = (root: unknown, path: Path): unknown => {
  let node = root;
  for (const key of path.slice(0, -1)) {
    if (!Predicate.isObject(node) && !Array.isArray(node)) return undefined;
    node = (node as Record<string | number, unknown>)[key];
  }
  return node;
};

const lastOf = (path: Path) => path[path.length - 1];

const read = (root: unknown, path: Path) => {
  const parent = parentOf(root, path);
  const key = lastOf(path);
  return key !== undefined &&
    (Predicate.isObject(parent) || Array.isArray(parent))
    ? (parent as Record<string | number, unknown>)[key]
    : undefined;
};

const write = (root: unknown, path: Path, value: string) => {
  const parent = parentOf(root, path);
  const key = lastOf(path);
  if (
    key !== undefined &&
    (Predicate.isObject(parent) || Array.isArray(parent))
  )
    (parent as Record<string | number, unknown>)[key] = value;
};

const remove = (root: unknown, path: Path) => {
  const parent = parentOf(root, path);
  const key = lastOf(path);
  if (Array.isArray(parent) && typeof key === 'number') parent.splice(key, 1);
  else if (key !== undefined && Predicate.isObject(parent))
    delete (parent as Record<string | number, unknown>)[key];
};

/** Later paths first, so taking an item out of a list moves none still to do. */
const latestFirst = (a: Path, b: Path) => {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const [x, y] = [a[i], b[i]];
    if (x === y) continue;
    if (typeof x === 'number' && typeof y === 'number') return y - x;
    return String(y).localeCompare(String(x));
  }
  return b.length - a.length;
};

/**
 * The resume made schema-valid without failing: values the schema rejects
 * are rewritten when the meaning is plain ("Jan 2020" is 2020-01,
 * example.com is https://example.com) and left out otherwise, each with a
 * warning. Checked with the same validator save_resume uses.
 */
export const repair = (input: Json): Repaired => {
  const resume: Json = structuredClone(compactResume(input));
  const warnings: string[] = [];
  const changed = new Set<string>();
  for (let round = 0; round < 3; round++) {
    const issues = validate(resume, schema).filter((i) => i.path.length > 0);
    if (issues.length === 0) break;
    for (const issue of [...issues].sort((a, b) =>
      latestFirst(a.path, b.path)
    )) {
      const value = read(resume, issue.path);
      const fixed = Predicate.isString(value)
        ? fix(value, issue.message)
        : undefined;
      if (fixed !== undefined) {
        write(resume, issue.path, fixed);
        changed.add(pointer(issue.path));
      } else {
        remove(resume, issue.path);
        warnings.push(`Left out ${pathLabel(issue.path)}: ${issue.message}`);
      }
    }
  }
  return { resume: compactResume(resume), warnings, changed };
};
