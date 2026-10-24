import type { JsonSchemaNode } from '@repo/schema-explorer';
import { Predicate } from 'effect';

/** How a field is edited. */
export type FieldKind =
  | 'text'
  | 'longText'
  | 'date'
  | 'url'
  | 'email'
  | 'boolean'
  /** A list of short words (keywords): chips. */
  | 'tags'
  /** A list of sentences (highlights, courses): one line each. */
  | 'lines'
  /** A nested object with its own fields (basics.location). */
  | 'group'
  /** A list of objects (work, basics.profiles). */
  | 'list'
  /** Text or a structured location (work.location). */
  | 'location';

export interface FieldSpec {
  key: string;
  label: string;
  kind: FieldKind;
  description?: string;
  /** The fields of a group, a list's items, or a structured location. */
  fields?: ReadonlyArray<FieldSpec>;
}

/** A top-level part of the resume, edited as one panel. */
export type SectionSpec = FieldSpec;

const LONG = new Set([
  'summary',
  'description',
  'reference',
  'objective',
  'address',
]);
const LINES = new Set(['highlights', 'courses', 'roles']);
/** Not edited in the form: tooling config, free-form extensions. */
const SKIP = new Set(['$schema', 'meta', 'custom']);
const ACRONYMS: Record<string, string> = { url: 'URL', id: 'ID' };

/** 'studyType' → 'Study type', 'url' → 'URL', 'credentialId' → 'Credential ID'. */
export function humanize(key: string): string {
  const words = key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(' ');
  return words
    .map(
      (w, i) =>
        ACRONYMS[w] ?? (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w)
    )
    .join(' ');
}

const resolve = (
  node: JsonSchemaNode,
  root: JsonSchemaNode
): JsonSchemaNode => {
  const name = node.$ref?.match(/^#\/definitions\/(.+)$/)?.[1];
  const target = name ? root.definitions?.[name] : undefined;
  return target
    ? { ...target, description: node.description ?? target.description }
    : node;
};

const isDate = (node: JsonSchemaNode) => node.$ref === '#/definitions/iso8601';

function field(
  key: string,
  raw: JsonSchemaNode,
  root: JsonSchemaNode
): FieldSpec | undefined {
  if (SKIP.has(key)) return undefined;
  const base = {
    key,
    label: humanize(key),
    ...(raw.description ? { description: raw.description } : {}),
  };
  const options = raw.oneOf ?? raw.anyOf;
  const structured = options
    ?.map((o) => resolve(o, root))
    .find((o) => o.type === 'object');
  if (options && structured) {
    return { ...base, kind: 'location', fields: fields(structured, root) };
  }
  if (isDate(raw)) return { ...base, kind: 'date' };
  const node = resolve(raw, root);
  switch (node.type) {
    case 'boolean':
      return { ...base, kind: 'boolean' };
    case 'array': {
      const items = node.items ? resolve(node.items, root) : undefined;
      if (items?.type === 'object')
        return { ...base, kind: 'list', fields: fields(items, root) };
      return { ...base, kind: LINES.has(key) ? 'lines' : 'tags' };
    }
    case 'object': {
      const inner = fields(node, root);
      return inner.length > 0
        ? { ...base, kind: 'group', fields: inner }
        : undefined;
    }
    case 'string':
      if (node.format === 'email') return { ...base, kind: 'email' };
      if (node.format === 'uri' || key === 'url' || key === 'image')
        return { ...base, kind: 'url' };
      return { ...base, kind: LONG.has(key) ? 'longText' : 'text' };
    default:
      return undefined;
  }
}

function fields(node: JsonSchemaNode, root: JsonSchemaNode): FieldSpec[] {
  return Object.entries(node.properties ?? {}).flatMap(
    ([key, child]) => field(key, child, root) ?? []
  );
}

/**
 * The form for a resume, read from the JSON Resume schema: every section
 * and field the schema has, so the editor keeps up with the spec.
 */
export const formSections = (
  schema: JsonSchemaNode
): ReadonlyArray<SectionSpec> => fields(schema, schema);

const TITLE_KEYS = [
  'name',
  'position',
  'institution',
  'organization',
  'title',
  'language',
  'network',
];

/** A list item's heading: its name, position, institution... or "Entry 3". */
export function itemTitle(item: unknown, index: number): string {
  if (Predicate.isObject(item)) {
    for (const key of TITLE_KEYS) {
      const value = item[key];
      if (typeof value === 'string' && value.trim() !== '') return value.trim();
    }
  }
  return `Entry ${index + 1}`;
}
