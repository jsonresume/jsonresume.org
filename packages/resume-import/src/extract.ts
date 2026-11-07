import { NothingToImport, UnsupportedImport } from '@repo/api';
import { Effect } from 'effect';
import mammoth from 'mammoth';
import { extractText, getDocumentProxy } from 'unpdf';
import type { Source } from './detect';

/** Shorter than this, there is no resume to read. */
const MIN_CHARS = 40;

/** Tidies text from any source: no form feeds, runs of spaces or blank lines. */
export const tidy = (text: string) =>
  text
    .replace(/\r\n?/g, '\n')
    .replace(/[\f\v\u00a0\t]+/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const enough = (text: string, empty: string) =>
  text.length >= MIN_CHARS
    ? Effect.succeed(text)
    : Effect.fail(new NothingToImport({ message: empty }));

/** A PDF's text, pages in order. */
export const pdfText = (bytes: Uint8Array) =>
  Effect.tryPromise({
    // PDF.js takes ownership of the buffer it is given: hand it a copy.
    // verbosity 0: it would otherwise write warnings to the console.
    try: async () => {
      const pdf = await getDocumentProxy(new Uint8Array(bytes), {
        verbosity: 0,
      });
      try {
        return await extractText(pdf, { mergePages: true });
      } finally {
        await pdf.loadingTask.destroy();
      }
    },
    catch: () =>
      new UnsupportedImport({
        message:
          'That PDF couldn’t be opened: it may be damaged or password protected.',
      }),
  }).pipe(
    Effect.flatMap(({ text }) =>
      enough(
        tidy(text),
        'This PDF has no text in it: it is probably a scan or an image. Export it again as a text PDF, or paste the text.'
      )
    ),
    Effect.withSpan('pdfText')
  );

/** A Word document's text, paragraph by paragraph. */
export const docxText = (bytes: Uint8Array) =>
  Effect.tryPromise({
    try: () => mammoth.extractRawText({ buffer: Buffer.from(bytes) }),
    catch: () =>
      new UnsupportedImport({
        message: 'That Word document couldn’t be opened: it may be damaged.',
      }),
  }).pipe(
    Effect.flatMap(({ value }) =>
      enough(tidy(value), 'This Word document has no text in it.')
    ),
    Effect.withSpan('docxText')
  );

/** Pasted or uploaded plain text. */
export const plainText = (text: string) =>
  enough(tidy(text), 'There isn’t enough text here to read a resume from.');

/** The model reads at most this much; longer text is cut, with a warning. */
const MAX_MODEL_CHARS = 40_000;

/** The text of a PDF, Word document or text, as a model reads it. */
export const modelText = (source: Exclude<Source, { kind: 'linkedin' }>) =>
  Effect.gen(function* () {
    const full =
      source.kind === 'pdf'
        ? yield* pdfText(source.bytes)
        : source.kind === 'docx'
        ? yield* docxText(source.bytes)
        : yield* plainText(source.text);
    const cut = full.length > MAX_MODEL_CHARS;
    return {
      text: cut ? full.slice(0, MAX_MODEL_CHARS) : full,
      warnings: cut
        ? ['The resume is very long: only its first part was read.']
        : [],
    };
  });
