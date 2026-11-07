import { Schema } from 'effect';
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import {
  THEME_METADATA,
  THEME_STYLES,
  THEME_LAYOUTS,
  THEME_COLORS,
  THEME_USAGE_SOURCE,
} from '../../packages/theme-config/src/index.js';
import { RESEARCHED_THEME_METADATA } from '../../packages/theme-config/src/researched.js';
import { portfolioIdeas } from './ideas.ts';

const { values } = parseArgs({ options: { deployed: { type: 'boolean' } } });
const ideas = portfolioIdeas();
const proposed = new Set(ideas.map((idea) => idea.slug));
const firstTen = new Set(Object.keys(RESEARCHED_THEME_METADATA));
const Source = Schema.Struct({
  asOf: Schema.String,
  metric: Schema.String,
  defaultTheme: Schema.String,
  publicProfiles: Schema.Number,
  renderableDocuments: Schema.Number,
  excludedDocuments: Schema.Number,
  firstRecordedView: Schema.NullOr(Schema.String),
  viewWindowDays: Schema.Number,
  choices: Schema.Array(
    Schema.Tuple([
      Schema.String,
      Schema.String,
      Schema.Number,
      Schema.Number,
      Schema.Number,
    ])
  ),
  recentViews: Schema.Array(
    Schema.Tuple([Schema.NullOr(Schema.String), Schema.Number, Schema.Number])
  ),
});
const source = Schema.decodeUnknownSync(Source)(
  JSON.parse(readFileSync('docs/theme-roadmap/usage-source.json', 'utf8'))
);
const adoption = new Map<
  string,
  { resumes: number; chosen: number; inherited: number }
>();
for (const [, slug, resumes, chosen, inherited] of source.choices) {
  const before = adoption.get(slug) ?? { resumes: 0, chosen: 0, inherited: 0 };
  adoption.set(slug, {
    resumes: before.resumes + resumes,
    chosen: before.chosen + chosen,
    inherited: before.inherited + inherited,
  });
}
const existing = Object.entries(THEME_METADATA)
  .filter(([slug]) => !proposed.has(slug))
  .map(([slug, theme]) => ({
    slug,
    ...theme,
    description:
      slug === 'tan-responsive'
        ? `${theme.description} Uses legacy company/picture fields; review compatibility with current resume data.`
        : theme.description,
    styleLabel: THEME_STYLES[theme.style],
    layoutLabel: THEME_LAYOUTS[theme.layout],
    colorLabel: THEME_COLORS[theme.color],
    status:
      slug === 'tan-responsive'
        ? 'Legacy schema review'
        : firstTen.has(slug) && !values.deployed
        ? 'Implemented, unreleased'
        : 'Available',
  }))
  .sort(
    (a, b) => b.usage.resumes - a.usage.resumes || a.name.localeCompare(b.name)
  );
const planned = ideas
  .map((idea) => ({
    ...idea,
    styleLabel: THEME_STYLES[idea.style],
    layoutLabel: THEME_LAYOUTS[idea.layout],
    colorLabel: THEME_COLORS[idea.color],
    anchorChosen: adoption.get(idea.anchor)?.chosen ?? 0,
    status: values.deployed
      ? 'Deployed'
      : Object.hasOwn(THEME_METADATA, idea.slug)
      ? 'Implemented'
      : 'Planned',
  }))
  .sort(
    (a, b) =>
      a.wave - b.wave ||
      b.anchorChosen - a.anchorChosen ||
      a.name.localeCompare(b.name)
  );
const missing = [...adoption]
  .filter(([slug]) => !Object.hasOwn(THEME_METADATA, slug))
  .map(([slug, counts]) => ({ slug, ...counts }))
  .sort((a, b) => b.resumes - a.resumes || a.slug.localeCompare(b.slug));
const data = {
  source,
  usageSource: THEME_USAGE_SOURCE,
  existing,
  planned,
  missing,
  facets: {
    styles: THEME_STYLES,
    layouts: THEME_LAYOUTS,
    colors: THEME_COLORS,
  },
};
writeFileSync(
  '/tmp/jsonresume-theme-roadmap/workbook-data.json',
  JSON.stringify(data)
);
process.stdout.write(
  `${existing.length} existing themes; ${planned.length} new themes; ${missing.length} off-catalogue choices.\n`
);
