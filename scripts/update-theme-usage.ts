import { Schema } from 'effect';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { THEME_METADATA } from '../packages/theme-config/src/metadata.js';

const Choice = Schema.Struct({
  slug: Schema.String,
  public_resumes: Schema.Number,
  explicit_choices: Schema.Number,
  default_assignments: Schema.Number,
});
const View = Schema.Struct({
  slug: Schema.NullOr(Schema.String),
  page_views: Schema.Number,
  viewed_resumes: Schema.Number,
});
const Snapshot = Schema.Struct({
  asOf: Schema.String,
  metric: Schema.String,
  defaultTheme: Schema.String,
  publicProfiles: Schema.Number,
  renderableDocuments: Schema.Number,
  excludedDocuments: Schema.Number,
  firstRecordedView: Schema.NullOr(Schema.String),
  viewWindowDays: Schema.Number,
  choices: Schema.Array(Choice),
  recentViews: Schema.Array(View),
});

const { values } = parseArgs({
  options: { ssh: { type: 'string' }, source: { type: 'string' } },
});
if (!values.ssh && !values.source)
  throw new Error('Provide --source <aggregate.json> or --ssh <user@host>.');
if (values.ssh && !/^[a-zA-Z0-9_][a-zA-Z0-9_.@:-]+$/.test(values.ssh))
  throw new Error('Invalid SSH destination.');
const raw = values.source
  ? readFileSync(values.source, 'utf8')
  : execFileSync(
      'ssh',
      [
        '-o',
        'BatchMode=yes',
        '-o',
        'StrictHostKeyChecking=yes',
        '-o',
        'ConnectTimeout=8',
        values.ssh ?? '',
        'sudo -n -u postgres psql -X -q -A -t -v ON_ERROR_STOP=1 -d jsonresume',
      ],
      {
        input: readFileSync('packages/theme-config/queries/usage.sql', 'utf8'),
        encoding: 'utf8',
      }
    );
const snapshot = Schema.decodeUnknownSync(Snapshot)(JSON.parse(raw));
const total = snapshot.choices.reduce((n, row) => n + row.public_resumes, 0);
if (total !== snapshot.renderableDocuments)
  throw new Error('Theme counts do not reconcile to the source population.');
if (
  snapshot.choices.some(
    (row) =>
      row.explicit_choices + row.default_assignments !== row.public_resumes
  )
)
  throw new Error('Explicit and inherited choices do not reconcile.');

const canonical = (slug: string) => slug.replace(/^jsonresume-theme-/, '');
const known = new Set(Object.keys(THEME_METADATA));
const counts = new Map<
  string,
  { resumes: number; chosen: number; inherited: number; views: number }
>();
for (const row of snapshot.choices) {
  const slug = canonical(row.slug);
  const previous = counts.get(slug) ?? {
    resumes: 0,
    chosen: 0,
    inherited: 0,
    views: 0,
  };
  counts.set(slug, {
    ...previous,
    resumes: previous.resumes + row.public_resumes,
    chosen: previous.chosen + row.explicit_choices,
    inherited: previous.inherited + row.default_assignments,
  });
}
for (const row of snapshot.recentViews) {
  if (!row.slug) continue;
  const slug = canonical(row.slug);
  const previous = counts.get(slug) ?? {
    resumes: 0,
    chosen: 0,
    inherited: 0,
    views: 0,
  };
  counts.set(slug, { ...previous, views: previous.views + row.page_views });
}

const source = {
  ...snapshot,
  choices: snapshot.choices.map((row) => [
    row.slug,
    canonical(row.slug),
    row.public_resumes,
    row.explicit_choices,
    row.default_assignments,
  ]),
  recentViews: snapshot.recentViews.map((row) => [
    row.slug,
    row.page_views,
    row.viewed_resumes,
  ]),
};
mkdirSync('docs/theme-roadmap', { recursive: true });
writeFileSync(
  'docs/theme-roadmap/usage-source.json',
  JSON.stringify(source, null, 2) + '\n'
);
const available = [...counts].filter(([slug]) => known.has(slug));
const missing = [...counts].filter(
  ([slug, row]) => !known.has(slug) && row.resumes > 0
);
const provenance = {
  asOf: snapshot.asOf,
  metric: 'Public resumes',
  population: snapshot.renderableDocuments,
  inheritedDefault: snapshot.choices.reduce(
    (n, row) => n + row.default_assignments,
    0
  ),
  unlistedThemeChoices: missing.reduce((n, [, row]) => n + row.resumes, 0),
  firstRecordedView: snapshot.firstRecordedView,
  viewWindowDays: snapshot.viewWindowDays,
};
const generated =
  '/** Aggregate production snapshot; no usernames or personal records. Refresh with scripts/update-theme-usage.ts. */\n' +
  `export const THEME_USAGE_SOURCE = ${JSON.stringify(
    provenance,
    null,
    2
  )};\n\n` +
  '/** Stored resumes, explicit choices, inherited defaults, recent page views. */\n' +
  `const counts = ${JSON.stringify(
    Object.fromEntries(
      available.map(([slug, row]) => [
        slug,
        [row.resumes, row.chosen, row.inherited, row.views],
      ])
    ),
    null,
    2
  )};\n\n` +
  'export const THEME_USAGE = Object.fromEntries(Object.entries(counts).map(([slug, [resumes, chosen, inherited, views]]) => [slug, { resumes, chosen, inherited, views }]));\n';
writeFileSync('packages/theme-config/src/usage.js', generated);
execFileSync(
  'pnpm',
  [
    'exec',
    'prettier',
    '--write',
    'packages/theme-config/src/usage.js',
    'docs/theme-roadmap/usage-source.json',
  ],
  { stdio: 'pipe' }
);
process.stdout.write(
  `${total} public resumes; ${provenance.inheritedDefault} inherit the default; ${provenance.unlistedThemeChoices} select themes outside the catalogue.\n`
);
