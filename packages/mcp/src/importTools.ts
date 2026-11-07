import { RateLimiter } from '@repo/accounts';
import { ImportResult } from '@repo/api';
import { Downloader, Importer, type ImportInput } from '@repo/resume-import';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';
import { optional } from './params';

/** Shared with POST /api/import's signed-in limit, per account. */
const PER_HOUR = 60;

export const ImportToolkit = Toolkit.make(
  Tool.make('import_resume', {
    description: describe('import_resume'),
    parameters: Schema.Struct({
      text: optional(
        Schema.String,
        'The resume as plain text, copied from anywhere'
      ),
      url: optional(
        Schema.String,
        'A public URL of the resume: a PDF, a Word .docx or a LinkedIn data export .zip'
      ),
    }),
    success: ImportResult,
    ...failing,
  }).annotateMerge(hints('import_resume', false, true))
);

/** Needs an Importer, a Downloader and the RateLimiter. */
export const ImportHandlers = ImportToolkit.toLayer(
  Effect.gen(function* () {
    const importer = yield* Importer;
    const downloader = yield* Downloader;
    const limiter = yield* RateLimiter;
    return {
      import_resume: ({ text, url }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          if ((text === undefined) === (url === undefined))
            return yield* failWith(
              'Give either text or url (exactly one of them).'
            );
          yield* limiter.hit(`import:user:${user.id}`, PER_HOUR, 3600);
          const input: ImportInput =
            url !== undefined
              ? { _tag: 'File', upload: yield* downloader.download(url) }
              : { _tag: 'Text', text: text ?? '' };
          return yield* importer.run(input, user.id);
        }).pipe(
          Effect.catchTags({
            TooManyAttempts: (e) =>
              failWith(
                `Too many imports: try again in ${Math.ceil(
                  e.retryAfterSeconds / 60
                )} minutes.`
              ),
            ImportTooLarge: (e) =>
              failWith(
                `That is too large to import (the limit is ${
                  e.maxBytes / 1024 / 1024
                } MB).`
              ),
            UnsupportedImport: (e) => failWith(e.message),
            NothingToImport: (e) => failWith(e.message),
            ImportFailed: (e) => failWith(e.message),
          })
        ),
    };
  })
);
