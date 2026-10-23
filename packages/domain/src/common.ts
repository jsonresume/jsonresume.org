import { Schema } from 'effect';

/** A calendar date as written in content: '2014-07-31'. */
export const IsoDate = Schema.String.pipe(
  Schema.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
);

/** Lowercase words joined by hyphens, as used in URLs: 'first-official-release'. */
export const Slug = Schema.String.pipe(
  Schema.check(Schema.isPattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
);

/** An absolute http(s) URL or a site-relative path starting with '/'. */
export const Href = Schema.String.pipe(
  Schema.check(Schema.isPattern(/^(https?:\/\/|\/)/))
);

export const NonEmptyText = Schema.NonEmptyString;
