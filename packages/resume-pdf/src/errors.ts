import { Schema } from 'effect';

/** The browser could not print the page. */
export class PdfFailed extends Schema.TaggedError<PdfFailed>()('PdfFailed', {
  message: Schema.String,
}) {}
