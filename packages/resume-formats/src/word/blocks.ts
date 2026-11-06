import {
  ExternalHyperlink,
  HeadingLevel,
  Paragraph,
  type ParagraphChild,
  TextRun,
} from 'docx';

type Parts = ReadonlyArray<string | undefined>;

/** The parts that are present. */
export const present = (parts: Parts): ReadonlyArray<string> =>
  parts.filter((part) => part !== undefined);

/** Parts joined with a separator, or absent when none are present. */
export const joined = (parts: Parts, separator = ' · ') => {
  const kept = present(parts);
  return kept.length > 0 ? kept.join(separator) : undefined;
};

/** A link that opens in the browser; mail addresses get mailto:. */
export const link = (target: string, label = target) =>
  new ExternalHyperlink({
    link: /^[^@\s/]+@[^@\s/]+$/.test(target) ? `mailto:${target}` : target,
    children: [new TextRun({ text: label, style: 'Hyperlink' })],
  });

/** Parts separated by dots, links clickable. */
export const runs = (
  parts: ReadonlyArray<ParagraphChild | string | undefined>
): ParagraphChild[] =>
  parts
    .filter((part) => part !== undefined)
    .flatMap((part, i) => [
      ...(i > 0 ? [new TextRun(' · ')] : []),
      typeof part === 'string' ? new TextRun(part) : part,
    ]);

/** A section: its Heading 1, then its blocks; nothing when it has none. */
export const section = (
  title: string,
  blocks: ReadonlyArray<Paragraph>
): Paragraph[] =>
  blocks.length > 0
    ? [
        new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }),
        ...blocks,
      ]
    : [];

/** An entry's title as a Heading 2. */
export const subheading = (title: string | undefined): Paragraph[] =>
  title
    ? [new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 })]
    : [];

/** Dates, places and links under a title, in the muted Details style. */
export const details = (
  parts: ReadonlyArray<ParagraphChild | string | undefined>
): Paragraph[] => {
  const children = runs(parts);
  return children.length > 0
    ? [new Paragraph({ style: 'Details', children })]
    : [];
};

/** A paragraph of body text, when there is some. */
export const body = (value: string | undefined): Paragraph[] =>
  value ? [new Paragraph({ text: value })] : [];

/** A bulleted list, one item each. */
export const bullets = (items: ReadonlyArray<string>): Paragraph[] =>
  items.map((item) => new Paragraph({ text: item, bullet: { level: 0 } }));

/** A bullet with a bold lead: "Frontend (Expert): React, TypeScript". */
export const item = (
  lead: string | undefined,
  rest: ReadonlyArray<ParagraphChild | string | undefined>
): Paragraph[] => {
  const after = runs(rest);
  if (!lead && after.length === 0) return [];
  const children = [
    ...(lead ? [new TextRun({ text: lead, bold: true })] : []),
    ...(lead && after.length > 0 ? [new TextRun(': ')] : []),
    ...after,
  ];
  return [new Paragraph({ children, bullet: { level: 0 } })];
};
