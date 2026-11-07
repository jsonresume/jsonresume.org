import { Accounts } from '@repo/accounts';
import { checkAts } from '@repo/ats';
import { dataFormats, formatResume } from '@repo/resume-formats';
import { findTheme } from '@repo/theme-gallery/catalog';
import { Effect, Predicate, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';
import { optional } from './params';

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
  'docx',
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
      resume: optional(
        Schema.Record(Schema.String, Schema.Unknown),
        'A resume to check instead of yours'
      ),
    }),
    success: AtsReport,
    ...failing,
  }).annotateMerge(hints('check_ats')),
  Tool.make('export_resume', {
    description: describe('export_resume'),
    parameters: Schema.Struct({
      format: ExportFormat,
      theme: optional(
        Schema.String,
        'For pdf: the theme to print in (default: your page’s)'
      ),
      paper: optional(
        Schema.Literals(['a4', 'letter']),
        'For pdf and docx: the paper (default: Letter in the US and Canada, else A4)'
      ),
      fit: optional(
        Schema.Boolean,
        'For pdf: shrink a resume that runs slightly over one page (by up to 15%) so it fits on one'
      ),
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
      export_resume: ({ format, theme, paper, fit }) =>
        Effect.gen(function* () {
          // A PDF in a theme that doesn't exist would be a link to a 404.
          if (format === 'pdf' && theme && !findTheme(theme)) {
            return yield* failWith(
              `No theme "${theme}". list_themes gives the slugs.`
            );
          }
          const { user, resume } = yield* current;
          const asked =
            format === 'pdf'
              ? { theme, paper, fit: fit ? '1' : undefined }
              : format === 'docx'
              ? { paper }
              : {};
          const query = new URLSearchParams(
            Object.entries(asked).flatMap(([k, v]) => (v ? [[k, v]] : []))
          ).toString();
          const url = `${SITE}/@${user.username}.${format}${
            query ? `?${query}` : ''
          }`;
          // Text comes back inline; the PDF, Word document and QR code are
          // files to open.
          const content =
            isText(format) && Predicate.isObject(resume)
              ? formatResume(format, resume).body
              : null;
          return { url, content };
        }),
    };
  })
);
