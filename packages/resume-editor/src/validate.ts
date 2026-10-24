import type { JsonSchemaNode } from '@repo/schema-explorer';
import { Predicate } from 'effect';
import type { Path } from './values';

export interface Issue {
  path: Path;
  message: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const typeOf = (v: unknown): string =>
  Array.isArray(v)
    ? 'array'
    : v === null
    ? 'null'
    : Number.isInteger(v)
    ? 'integer'
    : typeof v;

const article = (t: string) => (/^[aeiou]/.test(t) ? `an ${t}` : `a ${t}`);
const describe = (t: string | ReadonlyArray<string>) =>
  (Array.isArray(t) ? t : [t])
    .map((x: string) => (x === 'string' ? 'text' : x))
    .map(article)
    .join(' or ');

/**
 * Check a resume against the JSON Resume schema: types, date patterns and
 * email/URL formats, with where each problem is. The schema allows extra
 * keys, so only what it declares is checked (a reader-friendly subset of
 * JSON Schema, not a full validator).
 */
export function validate(
  value: unknown,
  schema: JsonSchemaNode,
  root: JsonSchemaNode = schema,
  path: Path = []
): Issue[] {
  const name = schema.$ref?.match(/^#\/definitions\/(.+)$/)?.[1];
  const node =
    name && root.definitions?.[name] ? root.definitions[name] : schema;
  const options = node.oneOf ?? node.anyOf;
  if (options) {
    const results = options.map((o) => validate(value, o, root, path));
    return results.some((r) => r.length === 0) ? [] : results[0] ?? [];
  }
  if (value === undefined) return [];
  const expected = node.type;
  if (expected !== undefined) {
    const actual = typeOf(value);
    const allowed = Array.isArray(expected) ? expected : [expected];
    const ok = allowed.some(
      (t: string) => t === actual || (t === 'number' && actual === 'integer')
    );
    if (!ok)
      return [
        {
          path,
          message: `Should be ${describe(expected)}, not ${article(
            actual === 'string' ? 'text' : actual
          )}.`,
        },
      ];
  }
  if (Predicate.isString(value)) {
    if (node.pattern && !new RegExp(node.pattern).test(value)) {
      return [
        {
          path,
          message:
            name === 'iso8601'
              ? 'Use a date like 2024-06-30, 2024-06 or 2024.'
              : 'Doesn’t match the expected format.',
        },
      ];
    }
    if (node.format === 'email' && value !== '' && !EMAIL.test(value))
      return [{ path, message: 'Should be an email address.' }];
    if (
      node.format === 'uri' &&
      value !== '' &&
      !/^[a-z][a-z0-9+.-]*:/i.test(value)
    ) {
      return [
        { path, message: 'Should be a full URL, starting with https://' },
      ];
    }
    return [];
  }
  if (Array.isArray(value)) {
    return node.items
      ? value.flatMap((item, i) =>
          validate(item, node.items ?? {}, root, [...path, i])
        )
      : [];
  }
  if (Predicate.isObject(value) && node.properties) {
    return Object.entries(node.properties).flatMap(([key, child]) =>
      validate(value[key], child, root, [...path, key])
    );
  }
  return [];
}

/** "work › 2 › startDate", for people. */
export const pathLabel = (path: Path) =>
  path.length === 0 ? 'resume' : path.join(' › ');
