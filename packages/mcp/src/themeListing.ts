import { THEME_USAGE_SOURCE } from '@jsonresume/theme-metadata';
import { themes } from '@repo/theme-gallery/catalog';
import { Schema } from 'effect';
import { optional } from './params';

export const ThemeSearch = Schema.Struct({
  query: optional(Schema.String),
  tag: optional(Schema.String),
  style: optional(Schema.String),
  layout: optional(Schema.String),
  color: optional(Schema.String),
  sort: optional(
    Schema.Literals(['usage', 'chosen', 'name', 'recommended']),
    'usage (default), chosen, name, or recommended: the recommended set first'
  ),
});

export const ListedTheme = Schema.Struct({
  slug: Schema.String,
  name: Schema.String,
  description: Schema.String,
  tags: Schema.Array(Schema.String),
  previewUrl: Schema.String,
  style: Schema.String,
  layout: Schema.String,
  color: Schema.String,
  recommended: Schema.Boolean,
  publicResumes: Schema.Number,
  explicitChoices: Schema.Number,
  inheritedDefaults: Schema.Number,
  usageRank: Schema.Number,
  usageAsOf: Schema.String,
});

export function themeListing(
  theme: (typeof themes)[number],
  previewUrl: string
) {
  return {
    slug: theme.slug,
    name: theme.name,
    description: theme.description,
    tags: theme.tags,
    previewUrl,
    style: theme.style,
    layout: theme.layout,
    color: theme.color,
    recommended: theme.recommended,
    publicResumes: theme.usage.resumes,
    explicitChoices: theme.usage.chosen,
    inheritedDefaults: theme.usage.inherited,
    usageRank:
      1 +
      themes.filter((other) => other.usage.resumes > theme.usage.resumes)
        .length,
    usageAsOf: THEME_USAGE_SOURCE.asOf,
  };
}
