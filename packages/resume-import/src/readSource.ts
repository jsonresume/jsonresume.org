import type { NothingToImport } from '@repo/api';
import { Effect } from 'effect';
import type { Unsure } from './confidence';
import type { Source } from './detect';
import { modelText } from './extract';
import { fromLinkedIn } from './linkedin';
import type { ResumeReader } from './reader';

/**
 * A source read into JSON Resume: a LinkedIn export by its CSVs, text by the
 * model, and a photo or a PDF with no text in it (a scan) by the model
 * looking at the file itself.
 */
export const readSource =
  (reader: ResumeReader['Service']) => (source: Source) =>
    Effect.gen(function* () {
      if (source.kind === 'linkedin') {
        const { resume, unsure } = fromLinkedIn(source.files);
        return { resume, unsure, warnings: [], model: null };
      }
      let warnings: ReadonlyArray<string> = [];
      let reply;
      if (source.kind === 'image') {
        reply = yield* reader.readFile(source);
      } else {
        const scan = source.kind === 'pdf' ? source.bytes : undefined;
        const extracted = yield* modelText(source).pipe(
          Effect.catchTag(
            'NothingToImport',
            (empty): Effect.Effect<undefined, NothingToImport> =>
              scan ? Effect.succeed(undefined) : Effect.fail(empty)
          )
        );
        if (extracted) {
          warnings = extracted.warnings;
          reply = yield* reader.read(extracted.text);
        } else {
          reply = yield* reader.readFile({
            mediaType: 'application/pdf',
            bytes: scan ?? new Uint8Array(),
          });
        }
      }
      const unsure: ReadonlyArray<Unsure> = reply.unsure;
      return { resume: reply.resume, unsure, warnings, model: reader.model };
    });
