import { Schema } from 'effect';
import { NonEmptyText, Slug } from './common';

/**
 * An example resume for a job title (/examples/<slug>): a fictional person,
 * written to show what a strong resume for the role looks like.
 */
export const ExampleResume = Schema.Struct({
  slug: Slug,
  /** The job title, as people search for it: "Software Engineer". */
  role: NonEmptyText,
  /** Which kind of work: Technology, Healthcare, … */
  field: NonEmptyText,
  /** Why this one works, for the page's lead. */
  intro: NonEmptyText,
  /** What to copy from it. */
  tips: Schema.Array(NonEmptyText),
  /** The resume itself (JSON Resume). */
  resume: Schema.Record(Schema.String, Schema.Unknown),
});
export type ExampleResume = typeof ExampleResume.Type;
