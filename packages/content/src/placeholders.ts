import { Schema } from 'effect';

/**
 * Facts that documents mention but must not hardcode. Documents write
 * `{{themeCount}}`; the site fills in the current value when rendering.
 */
export interface Facts {
  themeCount: number;
  schemaSectionCount: number;
  schemaVersion: string;
}

export const factNames: ReadonlyArray<keyof Facts> = [
  'themeCount',
  'schemaSectionCount',
  'schemaVersion',
];

export class UnknownPlaceholderError extends Schema.TaggedError<UnknownPlaceholderError>()(
  'UnknownPlaceholderError',
  { name: Schema.String }
) {}

const PLACEHOLDER = /\{\{\s*([A-Za-z]+)\s*\}\}/g;

const isFact = (name: string): name is keyof Facts =>
  (factNames as ReadonlyArray<string>).includes(name);

/** Names of every placeholder in a body, in order of appearance. */
export const placeholdersIn = (body: string): string[] =>
  [...body.matchAll(PLACEHOLDER)].map((m) => m[1]);

/** Replace placeholders with facts; throws on any name that is not a fact. */
export function fillFacts(body: string, facts: Facts): string {
  return body.replace(PLACEHOLDER, (_, name: string) => {
    if (!isFact(name)) throw new UnknownPlaceholderError({ name });
    const value = facts[name];
    return typeof value === 'number' ? value.toLocaleString('en-US') : value;
  });
}
