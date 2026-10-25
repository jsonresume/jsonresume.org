import schemaPackage from '@jsonresume/schema/package.json';
import schema from '@jsonresume/schema/schema.json';
import { THEME_METADATA } from '@jsonresume/theme-metadata';
import type { Facts } from './placeholders';

/** Top-level resume sections the schema defines (basics, work, ...). */
const sections = Object.keys(schema.properties).filter(
  (name) => name !== '$schema' && name !== 'meta'
);

/**
 * Current facts for documents, computed from the packages that own them so
 * they never drift: the theme list and the published schema.
 */
export const facts: Facts = {
  themeCount: Object.keys(THEME_METADATA).length,
  schemaSectionCount: sections.length,
  schemaVersion: schemaPackage.version,
};

export const schemaSections: ReadonlyArray<string> = sections;
