import { Document, HeadingLevel, Packer, Paragraph } from 'docx';
import { entries, place, text, type Entry } from './read';
import { body, details, direction, link, section } from './word/blocks';
import { xmlSafe } from './word/clean';
import { sections, web } from './word/sections';
import { styles } from './word/styles';

export const docxContentType =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/** The page, in twentieths of a point: A4, or US Letter. */
const PAGES = {
  a4: { width: 11906, height: 16838 },
  letter: { width: 12240, height: 15840 },
} as const;

/** Name, headline, contact line and profiles, then the summary. */
const header = (basics: Entry): Paragraph[] => {
  const name = text(basics['name']);
  const label = text(basics['label']);
  const email = text(basics['email']);
  const profiles = entries(basics['profiles']).map((p) => {
    const network = text(p['network']);
    const handle = text(p['username']);
    const url = text(p['url']);
    const shown = [network, handle].filter(Boolean).join(': ');
    if (url) return link(url, shown || url);
    return shown || undefined;
  });
  return [
    ...(name
      ? [
          new Paragraph({
            text: name,
            heading: HeadingLevel.TITLE,
            ...direction(name),
          }),
        ]
      : []),
    ...(label
      ? [
          new Paragraph({
            style: 'Headline',
            text: label,
            ...direction(label),
          }),
        ]
      : []),
    ...details([
      email ? link(email) : undefined,
      text(basics['phone']),
      web(basics['url']),
      place(basics['location']),
    ]),
    ...details(profiles),
    ...section('Summary', body(text(basics['summary']))),
  ];
};

/**
 * A resume as a Word document: real headings, paragraphs and bullet lists
 * in one plain layout, every standard section that has content, so it
 * opens ready to edit in Word, Pages, Google Docs or LibreOffice. On A4
 * unless the paper is Letter; Arabic and Hebrew paragraphs run right to
 * left. Characters XML can't hold are left out.
 */
export const toDocx = (
  input: Entry,
  paper: 'a4' | 'letter' = 'a4'
): Promise<Uint8Array<ArrayBuffer>> => {
  const resume = entries([xmlSafe(input)])[0] ?? {};
  const basics = entries([resume['basics']])[0] ?? {};
  const name = text(basics['name']);
  const document = new Document({
    creator: name ?? 'jsonresume.org',
    lastModifiedBy: 'jsonresume.org',
    title: name ? `${name} – Resume` : 'Resume',
    description: 'Made from a JSON Resume at jsonresume.org',
    styles,
    sections: [
      {
        properties: {
          page: {
            size: PAGES[paper],
            margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
          },
        },
        children: [...header(basics), ...sections(resume)],
      },
    ],
  });
  return Packer.toArrayBuffer(document).then(
    (buffer) => new Uint8Array(buffer)
  );
};
