import type { Diagnostic } from '@jsonresume/ui';
import type { JsonSchemaNode } from '@repo/schema-explorer';
import { findNodeAtLocation, parseTree } from 'jsonc-parser';
import { pathLabel, validate } from './validate';

/**
 * Schema problems in JSON text, placed on the value they are about, for the
 * code editor's lint gutter. Syntax errors are the editor's own; text that
 * doesn't parse has no schema problems yet.
 */
export function schemaDiagnostics(
  text: string,
  schema: JsonSchemaNode
): Diagnostic[] {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return [];
  }
  const tree = parseTree(text);
  if (!tree) return [];
  return validate(value, schema).map((issue) => {
    const node = findNodeAtLocation(tree, [...issue.path]);
    const from = node?.offset ?? 0;
    return {
      from,
      to: from + (node?.length ?? 1),
      severity: 'warning',
      message:
        issue.path.length > 0
          ? `${pathLabel(issue.path)}: ${issue.message}`
          : issue.message,
    };
  });
}
