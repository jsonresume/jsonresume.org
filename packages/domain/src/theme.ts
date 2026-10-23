import { Schema } from 'effect';
import { NonEmptyText, Slug } from './common';

/** A resume theme the registry can render, from @jsonresume/theme-metadata. */
export const ThemeSummary = Schema.Struct({
  slug: Slug,
  name: NonEmptyText,
  description: NonEmptyText,
  author: NonEmptyText,
  tags: Schema.Array(NonEmptyText),
});
export type ThemeSummary = typeof ThemeSummary.Type;
