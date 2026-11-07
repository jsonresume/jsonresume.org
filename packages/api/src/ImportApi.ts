import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from 'effect/http-api';
import { TooManyAttempts } from './errors';

/** Largest file (or pasted text, in bytes) an import takes. */
export const IMPORT_MAX_BYTES = 5 * 1024 * 1024;

/** Where an import came from: a PDF, a Word document, a LinkedIn export or text. */
export const ImportKind = Schema.Literals(['pdf', 'docx', 'linkedin', 'text']);
export type ImportKind = typeof ImportKind.Type;

/** How sure the import is of one field. */
export const FieldConfidence = Schema.Literals(['high', 'medium', 'low']);
export type FieldConfidence = typeof FieldConfidence.Type;

/** A resume read from a file or text, for the person to review before saving. */
export const ImportResult = Schema.Struct({
  /** Schema-valid JSON Resume; fields that failed the schema were dropped. */
  resume: Schema.Record(Schema.String, Schema.Unknown),
  /** Every filled field, by JSON pointer (/work/0/name), with how sure the import is. */
  confidence: Schema.Record(Schema.String, FieldConfidence),
  kind: ImportKind,
  /** What was dropped, cut short or couldn't be read, for people. */
  warnings: Schema.Array(Schema.String),
  /** How many fields were filled. */
  fields: Schema.Number,
  /** The same input was read before, so this is the earlier result. */
  cached: Schema.Boolean,
  ms: Schema.Number,
});
export type ImportResult = typeof ImportResult.Type;

/** Not a file an import reads (PDF, .docx, LinkedIn export .zip, text). */
export class UnsupportedImport extends Schema.TaggedError<UnsupportedImport>()(
  'UnsupportedImport',
  { message: Schema.String },
  { httpApiStatus: 415 }
) {}

/** Larger than IMPORT_MAX_BYTES. */
export class ImportTooLarge extends Schema.TaggedError<ImportTooLarge>()(
  'ImportTooLarge',
  { maxBytes: Schema.Number },
  { httpApiStatus: 413 }
) {}

/** Readable, but with no text in it: a scanned PDF, an empty document. */
export class NothingToImport extends Schema.TaggedError<NothingToImport>()(
  'NothingToImport',
  { message: Schema.String },
  { httpApiStatus: 422 }
) {}

/** The model that reads resumes failed or isn't configured; try again. */
export class ImportFailed extends Schema.TaggedError<ImportFailed>()(
  'ImportFailed',
  { message: Schema.String },
  { httpApiStatus: 502 }
) {}

/** Pasted text, as JSON. */
export const ImportText = Schema.Struct({ text: Schema.String });

/** A file, as multipart/form-data with a `file` part (read as it streams). */
const ImportUpload = Schema.Struct({
  file: Schema.Unknown.annotate({
    description:
      'The resume: a PDF, a Word .docx, a LinkedIn export .zip or a .txt',
  }),
}).pipe(
  HttpApiSchema.asMultipartStream({
    maxParts: 4,
    maxFileSize: IMPORT_MAX_BYTES,
    maxFieldSize: IMPORT_MAX_BYTES,
  })
);

/**
 * Turns a resume into JSON Resume without saving it: the review screen
 * shows it, and saving goes through account.saveResume. Works signed out
 * (onboarding imports before sign-up), rate limited per address.
 */
export class ImportApi extends HttpApiGroup.make('import').add(
  HttpApiEndpoint.post('resume', '/import', {
    payload: [ImportText, ImportUpload],
    success: ImportResult,
    error: [
      UnsupportedImport,
      ImportTooLarge,
      NothingToImport,
      ImportFailed,
      TooManyAttempts,
    ],
  }),
  // The start page's preview: an unsaved resume in a theme, before sign-up.
  HttpApiEndpoint.post('preview', '/import/preview', {
    payload: Schema.Struct({ resume: Schema.Unknown, theme: Schema.String }),
    success: Schema.String.pipe(
      HttpApiSchema.asText({ contentType: 'text/html' })
    ),
    error: TooManyAttempts,
  })
) {}
