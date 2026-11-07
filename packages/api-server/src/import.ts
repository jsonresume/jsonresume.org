import { Accounts, RateLimiter } from '@repo/accounts';
import {
  IMPORT_MAX_BYTES,
  ImportTooLarge,
  JsonResumeApi,
  NothingToImport,
  sessionCookie,
  UnsupportedImport,
} from '@repo/api';
import { Importer, type ImportInput } from '@repo/resume-import';
import { Effect, Stream } from 'effect';
import { Multipart } from 'effect/http';
import { HttpApiBuilder } from 'effect/http-api';
import { client, cookie } from './http';
import { previewHtml } from './preview';

/** Per hour: signed out by address (onboarding), signed in by account. */
const ANONYMOUS_PER_HOUR = 10;
const SIGNED_IN_PER_HOUR = 60;
/** Previews before sign-up, per address: one per settled edit or theme. */
const PREVIEWS_PER_HOUR = 240;

const LIMITS = new Set(['FileTooLarge', 'FieldTooLarge', 'BodyTooLarge']);

/**
 * A multipart upload as an import: the `file` part, read into memory as it
 * streams (never written to disk), or a `text` field.
 */
const fromParts = (
  parts: Stream.Stream<Multipart.Part, Multipart.MultipartError>
) =>
  Effect.gen(function* () {
    let found: ImportInput | undefined;
    yield* Stream.runForEach(parts, (part) =>
      Effect.gen(function* () {
        if (Multipart.isFile(part)) {
          const bytes = yield* part.contentEffect;
          if (part.key === 'file' && !found)
            found = {
              _tag: 'File',
              upload: { bytes, name: part.name, contentType: part.contentType },
            };
        } else if (Multipart.isField(part) && part.key === 'text' && !found) {
          found = { _tag: 'Text', text: part.value };
        }
      })
    );
    if (!found)
      return yield* new NothingToImport({
        message: 'Send the resume as a `file` part, or `text`.',
      });
    return found;
  }).pipe(
    Effect.catchTag('MultipartError', (e) =>
      Effect.fail(
        LIMITS.has(e.reason._tag)
          ? new ImportTooLarge({ maxBytes: IMPORT_MAX_BYTES })
          : new UnsupportedImport({ message: 'That upload couldn’t be read.' })
      )
    )
  );

/**
 * POST /api/import: a file or text into JSON Resume, for the review screen.
 * Signed out works too (onboarding imports before sign-up).
 */
export const ImportHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'import',
  (handlers) =>
    Effect.gen(function* () {
      const importer = yield* Importer;
      const accounts = yield* Accounts;
      const limiter = yield* RateLimiter;
      const signedIn = Effect.flatMap(cookie(sessionCookie.key), (token) =>
        token
          ? accounts.session(token).pipe(
              Effect.map((u): string | undefined => u.id),
              Effect.orElseSucceed(() => undefined)
            )
          : Effect.succeed(undefined)
      );
      return handlers
        .handle('preview', ({ payload }) =>
          Effect.gen(function* () {
            const who = yield* client;
            yield* limiter.hit(
              `import-preview:${who.address}`,
              PREVIEWS_PER_HOUR,
              3600
            );
            return yield* previewHtml(payload.resume, payload.theme);
          })
        )
        .handle('resume', ({ payload }) =>
          Effect.gen(function* () {
            const userId = yield* signedIn;
            if (userId)
              yield* limiter.hit(
                `import:user:${userId}`,
                SIGNED_IN_PER_HOUR,
                3600
              );
            else {
              const who = yield* client;
              yield* limiter.hit(
                `import:${who.address}`,
                ANONYMOUS_PER_HOUR,
                3600
              );
            }
            const input: ImportInput = Stream.isStream(payload)
              ? yield* fromParts(payload)
              : { _tag: 'Text', text: payload.text };
            return yield* importer.run(input, userId);
          })
        );
    })
);
