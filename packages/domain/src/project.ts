import { Schema } from 'effect';
import { Href, NonEmptyText } from './common';

/** What a community project does, used to group and filter the directory. */
export const ProjectCategory = Schema.Literals([
  'integration',
  'framework',
  'validator',
  'hosting',
  'ai',
  'transfer',
  'github',
  'editor',
  'cli',
  'visualization',
  'generator',
  'parser',
  'ats',
]);
export type ProjectCategory = typeof ProjectCategory.Type;

/** A community-built tool, library or service that works with JSON Resume. */
export const Project = Schema.Struct({
  name: NonEmptyText,
  description: NonEmptyText,
  link: Href,
  category: ProjectCategory,
  language: NonEmptyText,
});
export type Project = typeof Project.Type;
