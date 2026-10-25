import { Schema } from 'effect';
import { IsoDate, NonEmptyText, Slug } from './common';

/** Front matter of a blog post, as written at the top of its Markdown file. */
export const BlogPostMeta = Schema.Struct({
  title: NonEmptyText,
  date: IsoDate,
  author: NonEmptyText,
  description: Schema.optionalKey(NonEmptyText),
});
export type BlogPostMeta = typeof BlogPostMeta.Type;

export const BlogPost = Schema.Struct({
  ...BlogPostMeta.fields,
  slug: Slug,
  /** Markdown body, without the front matter. */
  body: Schema.String,
});
export type BlogPost = typeof BlogPost.Type;

/** A long-form documentation page (CLI reference, theme guide, ...). */
export const DocMeta = Schema.Struct({
  title: NonEmptyText,
  description: NonEmptyText,
});
export type DocMeta = typeof DocMeta.Type;

export const Doc = Schema.Struct({
  ...DocMeta.fields,
  slug: Slug,
  body: Schema.String,
});
export type Doc = typeof Doc.Type;
