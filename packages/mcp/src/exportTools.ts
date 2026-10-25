import { Accounts } from '@repo/accounts';
import { checkAts } from '@repo/ats';
import { dataFormats, formatResume } from '@repo/resume-formats';
import { Effect, Predicate, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, hints } from './context';

const SITE = 'https://jsonresume.org';

const Issue = Schema.Struct({
  severity: Schema.Literals(['critical', 'warning', 'tip']),
  message: Schema.String,
  fix: Schema.String,
  field: Schema.String,
});

const AtsReport = Schema.Struct({
  score: Schema.Number,
  rating: Schema.Literals(['Excellent', 'Good', 'Fair', 'Needs work']),
  summary: Schema.String,
  checks: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      score: Schema.Number,
      max: Schema.Number,
      issues: Schema.Array(Issue),
    })
  ),
});

const ExportFormat = Schema.Literals([
  'pdf',
  'json',
  'yaml',
  'txt',
  'rendercv',
  'qr',
]);

const isText = (format: string): format is (typeof dataFormats)[number] =>
  (dataFormats as ReadonlyArray<string>).includes(format);

export const ExportToolkit = Toolkit.make(
  Tool.make('check_ats', {
    description: describe('check_ats'),
    parameters: Schema.Struct({
      resume: Schema.optional(
        Schema.Record(Schema.String, Schema.Unknown).annotate({
          description: 'A resume to check instead of yours',
        })
      ),
    }),
    success: AtsReport,
    ...failing,
  }).annotateMerge(hints('check_ats')),
  Tool.make('export_resume', {
    description: describe('export_resume'),
    parameters: Schema.Struct({
      format: ExportFormat,
      theme: Schema.optional(Schema.String).annotate({
        description: 'For pdf: the theme to print in (default: your page’s)',
      }),
      paper: Schema.optional(Schema.Literals(['a4', 'letter'])),
    }),
    success: Schema.Struct({
      url: Schema.String,
      content: Schema.NullOr(Schema.String),
    }),
    ...failing,
  }).annotateMerge(hints('export_resume'))
);

/** Needs Accounts. */
export const ExportHandlers = ExportToolkit.toLayer(
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    const current = Effect.gen(function* () {
      const user = yield* caller;
      return { user, ...(yield* accounts.currentResume(user.id)) };
    });
    return {
      check_ats: ({ resume }) =>
        Effect.map(
          resume === undefined
            ? Effect.map(current, (c) => c.resume)
            : Effect.succeed(resume),
          checkAts
        ),
      export_resume: ({ format, theme, paper }) =>
        Effect.gen(function* () {
          const { user, resume } = yield* current;
          const query = new URLSearchParams(
            Object.entries({ theme, paper }).flatMap(([k, v]) =>
              v ? [[k, v]] : []
            )
          ).toString();
          const url = `${SITE}/@${user.username}.${format}${
            query && format === 'pdf' ? `?${query}` : ''
          }`;
          // Text comes back inline; the PDF and the QR code are files to open.
          const content =
            isText(format) && Predicate.isObject(resume)
              ? formatResume(format, resume).body
              : null;
          return { url, content };
        }),
    };
  })
);
