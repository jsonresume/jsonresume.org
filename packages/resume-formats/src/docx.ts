import { Document, HeadingLevel, Packer, Paragraph } from 'docx';
import { entries, place, text, type Entry } from './read';
import { body, details, link, section } from './word/blocks';
import { sections, web } from './word/sections';
import { styles } from './word/styles';

export const docxContentType =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

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
      ? [new Paragraph({ text: name, heading: HeadingLevel.TITLE })]
      : []),
    ...(label ? [new Paragraph({ style: 'Headline', text: label })] : []),
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
 * opens ready to edit in Word, Pages or Google Docs.
 */
export const toDocx = (resume: Entry): Promise<Uint8Array<ArrayBuffer>> => {
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
