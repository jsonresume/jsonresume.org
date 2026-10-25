import type { JsonSchemaNode } from './model';

/** One row of a section's field table. */
export interface SchemaField {
  /** Dotted path within the section, e.g. 'location.city' or 'profiles[].url'. */
  path: string;
  /** Nesting depth, 0 for direct fields. */
  depth: number;
  /** Human-readable type: 'text', 'URL', 'date', 'list of text', 'text or location'. */
  type: string;
  description?: string;
}

/** A top-level property of the schema: basics, work, skills, ... */
export interface SchemaSection {
  key: string;
  type: string;
  description?: string;
  fields: SchemaField[];
}

const FORMAT_LABELS: Record<string, string> = {
  uri: 'URL',
  email: 'email',
  'date-time': 'date and time',
  date: 'date',
};

/** Resolve '#/definitions/name' against the root; other refs stay as-is. */
function resolve(
  node: JsonSchemaNode,
  root: JsonSchemaNode
): JsonSchemaNode & { refName?: string } {
  const match = node.$ref?.match(/^#\/definitions\/(.+)$/);
  const target = match ? root.definitions?.[match[1]] : undefined;
  return target
    ? { ...target, ...node, $ref: undefined, refName: match?.[1] }
    : node;
}

const baseType = (type: JsonSchemaNode['type']): string | undefined =>
  typeof type === 'string' || type === undefined ? type : type.join(' or ');

/** A readable type label for a node. */
export function typeLabel(input: JsonSchemaNode, root: JsonSchemaNode): string {
  const node = resolve(input, root);
  const choices = node.oneOf ?? node.anyOf;
  if (choices?.length)
    return choices.map((c) => typeLabel(c, root)).join(' or ');
  if (node.enum?.length)
    return `one of ${node.enum.map((v) => JSON.stringify(v)).join(', ')}`;
  if (node.refName === 'iso8601') return 'date';
  const type = baseType(node.type);
  if (type === 'array') {
    const item = node.items ? typeLabel(node.items, root) : 'anything';
    return `list of ${item === 'object' ? 'objects' : item}`;
  }
  if (type === 'string')
    return node.format ? FORMAT_LABELS[node.format] ?? node.format : 'text';
  if (type === 'object') return node.refName ?? 'object';
  if (type === 'integer' || type === 'number') return 'number';
  if (type === 'boolean') return 'true or false';
  return type ?? (node.refName ? `${node.refName} (any value)` : 'any value');
}

/** The object node whose properties a value of `node` has, if any. */
function objectShape(
  input: JsonSchemaNode,
  root: JsonSchemaNode
): JsonSchemaNode | undefined {
  const node = resolve(input, root);
  if (node.properties) return node;
  const choice = (node.oneOf ?? node.anyOf)
    ?.map((c) => resolve(c, root))
    .find((c) => c.properties);
  if (choice) return choice;
  if (node.items) return objectShape(node.items, root);
  return undefined;
}

const isList = (node: JsonSchemaNode, root: JsonSchemaNode) =>
  baseType(resolve(node, root).type) === 'array';

function fieldsOf(
  shape: JsonSchemaNode,
  root: JsonSchemaNode,
  prefix = '',
  depth = 0
): SchemaField[] {
  return Object.entries(shape.properties ?? {}).flatMap(([name, child]) => {
    const resolved = resolve(child, root);
    const path = `${prefix}${name}`;
    const row: SchemaField = {
      path,
      depth,
      type: typeLabel(child, root),
      ...(resolved.description ? { description: resolved.description } : {}),
    };
    const nested = depth < 2 ? objectShape(child, root) : undefined;
    const nestedPrefix = `${path}${isList(child, root) ? '[]' : ''}.`;
    return [
      row,
      ...(nested ? fieldsOf(nested, root, nestedPrefix, depth + 1) : []),
    ];
  });
}

/**
 * The schema's top-level properties as sections with flat field lists.
 * `skip` drops properties that are plumbing rather than content ($schema).
 */
export function schemaSections(
  root: JsonSchemaNode,
  skip: ReadonlyArray<string> = ['$schema']
): SchemaSection[] {
  return Object.entries(root.properties ?? {})
    .filter(([key]) => !skip.includes(key))
    .map(([key, node]) => {
      const resolved = resolve(node, root);
      const shape = objectShape(node, root);
      return {
        key,
        type: typeLabel(node, root),
        ...(resolved.description ? { description: resolved.description } : {}),
        fields: shape ? fieldsOf(shape, root) : [],
      };
    });
}

/**
 * The example's value for a section, trimmed for display: lists show their
 * first entry only, so long sections stay readable.
 */
export function exampleFor(example: unknown, key: string): string | undefined {
  if (typeof example !== 'object' || example === null || !(key in example))
    return undefined;
  const value: unknown = (example as Record<string, unknown>)[key];
  const shown = Array.isArray(value) && value.length > 1 ? [value[0]] : value;
  return JSON.stringify({ [key]: shown }, null, 2);
}
