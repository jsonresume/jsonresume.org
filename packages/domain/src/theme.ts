import { Schema } from 'effect';
import { NonEmptyText, Slug } from './common';

/** A resume theme the registry can render, from @jsonresume/theme-metadata. */
export const ThemeSummary = Schema.Struct({
  slug: Slug,
  name: NonEmptyText,
  description: NonEmptyText,
  author: NonEmptyText,
  tags: Schema.Array(NonEmptyText),
  style: NonEmptyText,
  layout: NonEmptyText,
  color: NonEmptyText,
  usage: Schema.Struct({
    resumes: Schema.Number,
    chosen: Schema.Number,
    inherited: Schema.Number,
    views: Schema.Number,
  }),
});
export type ThemeSummary = typeof ThemeSummary.Type;
