import { UnsupportedImport } from '@repo/api';
import { Effect } from 'effect';
import { unzipSync } from 'fflate';

/** An uploaded file, as received: nothing about it is kept. */
export interface Upload {
  bytes: Uint8Array;
  name?: string | undefined;
  contentType?: string | undefined;
}

/** What a file turned out to be, ready to read. */
export type Source =
  | { kind: 'pdf'; bytes: Uint8Array }
  | { kind: 'docx'; bytes: Uint8Array }
  | { kind: 'linkedin'; files: ReadonlyMap<string, string> }
  | { kind: 'text'; text: string }
  /** A photo or screenshot of a resume, read by the model as an image. */
  | { kind: 'image'; bytes: Uint8Array; mediaType: string };

/** The CSVs of a LinkedIn data export that become a resume. */
export const LINKEDIN_FILES = [
  'Profile.csv',
  'Positions.csv',
  'Education.csv',
  'Skills.csv',
  'Languages.csv',
  'Certifications.csv',
  'Projects.csv',
  'Honors.csv',
  'Publications.csv',
  'Volunteering.csv',
  'Email Addresses.csv',
  'PhoneNumbers.csv',
];

const MAX_CSV_BYTES = 10 * 1024 * 1024;

const startsWith = (bytes: Uint8Array, magic: ReadonlyArray<number>) =>
  magic.every((b, i) => bytes[i] === b);

const PDF = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
const ZIP = [0x50, 0x4b, 0x03, 0x04];
const OLE = [0xd0, 0xcf, 0x11, 0xe0]; // .doc, .xls
/** Images the model reads, by their first bytes. */
const IMAGES: ReadonlyArray<[ReadonlyArray<number>, string]> = [
  [[0x89, 0x50, 0x4e, 0x47], 'image/png'],
  [[0xff, 0xd8, 0xff], 'image/jpeg'],
];
const RIFF = [0x52, 0x49, 0x46, 0x46];
const WEBP = [0x57, 0x45, 0x42, 0x50]; // at byte 8, after RIFF and a size
const GIF = [0x47, 0x49, 0x46, 0x38];

const imageType = (bytes: Uint8Array) =>
  IMAGES.find(([magic]) => startsWith(bytes, magic))?.[1] ??
  (startsWith(bytes, RIFF) && startsWith(bytes.subarray(8), WEBP)
    ? 'image/webp'
    : undefined);

const unsupported = (message: string) => new UnsupportedImport({ message });

const SUPPORTED =
  'Import a PDF, a Word document (.docx), a photo or screenshot (PNG, JPEG, WebP), a LinkedIn data export (.zip) or plain text.';

const basename = (path: string) => path.split('/').pop() ?? path;

const fromZip = (bytes: Uint8Array) =>
  Effect.try({
    try: () => {
      const names: string[] = [];
      const files = unzipSync(bytes, {
        filter: (f) => {
          names.push(f.name);
          return (
            LINKEDIN_FILES.includes(basename(f.name)) &&
            f.originalSize <= MAX_CSV_BYTES
          );
        },
      });
      return { names, files };
    },
    catch: () => unsupported('That .zip file couldn’t be opened.'),
  }).pipe(
    Effect.flatMap(
      ({ names, files }): Effect.Effect<Source, UnsupportedImport> => {
        if (names.includes('word/document.xml'))
          return Effect.succeed({ kind: 'docx', bytes });
        const csv = new Map<string, string>();
        const decoder = new TextDecoder('utf-8');
        for (const [name, data] of Object.entries(files))
          csv.set(basename(name), decoder.decode(data));
        if (csv.has('Profile.csv') || csv.has('Positions.csv'))
          return Effect.succeed({ kind: 'linkedin', files: csv });
        return Effect.fail(
          unsupported(
            'That .zip isn’t a LinkedIn data export (it has no Profile.csv or Positions.csv). ' +
              SUPPORTED
          )
        );
      }
    )
  );

const asText = (bytes: Uint8Array) =>
  Effect.try({
    try: () => new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    catch: () => unsupported(`That file isn’t one we can read. ${SUPPORTED}`),
  }).pipe(
    Effect.filterOrFail(
      (text) => !text.includes('\u0000') && !text.startsWith('{\\rtf'),
      () => unsupported(`That file isn’t one we can read. ${SUPPORTED}`)
    )
  );

/** What a file is, by its first bytes (never by its name alone). */
export const detect = (
  upload: Upload
): Effect.Effect<Source, UnsupportedImport> => {
  const { bytes } = upload;
  const head = bytes.subarray(0, 1024);
  if (startsWith(bytes, PDF) || Buffer.from(head).includes('%PDF-'))
    return Effect.succeed({ kind: 'pdf', bytes });
  if (startsWith(bytes, ZIP)) return fromZip(bytes);
  if (startsWith(bytes, OLE))
    return Effect.fail(
      unsupported(
        'Older Word documents (.doc) can’t be read. Save it as .docx or PDF and import that.'
      )
    );
  const mediaType = imageType(bytes);
  if (mediaType) return Effect.succeed({ kind: 'image', bytes, mediaType });
  if (startsWith(bytes, GIF))
    return Effect.fail(
      unsupported(
        'GIF images can’t be read. Save it as PNG or JPEG, or import a PDF.'
      )
    );
  return Effect.map(asText(bytes), (text) => ({ kind: 'text', text } as const));
};
