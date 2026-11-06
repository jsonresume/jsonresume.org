import resume from '@jsonresume/sample-data/complete-resume.json';
import { inflateRawSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { toDocx } from './docx';

/** The files in a zip, by name: enough of the format to read a .docx. */
const unzip = (zip: Uint8Array): Map<string, string> => {
  const view = Buffer.from(zip.buffer, zip.byteOffset, zip.byteLength);
  const end = view.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const count = view.readUInt16LE(end + 10);
  let at = view.readUInt32LE(end + 16);
  const files = new Map<string, string>();
  for (let i = 0; i < count; i++) {
    const method = view.readUInt16LE(at + 10);
    const size = view.readUInt32LE(at + 20);
    const nameLength = view.readUInt16LE(at + 28);
    const skip = nameLength + view.readUInt16LE(at + 30);
    const local = view.readUInt32LE(at + 42);
    const name = view.toString('utf8', at + 46, at + 46 + nameLength);
    at += 46 + skip + view.readUInt16LE(at + 32);
    const start =
      local +
      30 +
      view.readUInt16LE(local + 26) +
      view.readUInt16LE(local + 28);
    const data = view.subarray(start, start + size);
    files.set(
      name,
      (method === 8 ? inflateRawSync(data) : data).toString('utf8')
    );
  }
  return files;
};

/** The text of a document.xml, run by run, paragraphs on their own lines. */
const plain = (xml: string) =>
  xml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&');

const files = unzip(await toDocx(resume));
const xml = files.get('word/document.xml') ?? '';
const text = plain(xml);

describe('toDocx', () => {
  it('is a Word document', () => {
    expect(files.has('[Content_Types].xml')).toBe(true);
    expect(files.get('[Content_Types].xml')).toContain(
      'wordprocessingml.document.main+xml'
    );
    expect(xml).toContain('<w:body>');
  });

  it('starts with the name as the title, then the headline', () => {
    expect(xml).toMatch(new RegExp(`w:val="Title"/>.*?${resume.basics.name}`));
    expect(text).toContain(resume.basics.label);
  });

  it('has every section, each a Heading 1', () => {
    for (const title of [
      'Summary',
      'Work experience',
      'Volunteering',
      'Projects',
      'Education',
      'Awards',
      'Certificates',
      'Publications',
      'Skills',
      'Languages',
      'Interests',
      'References',
    ]) {
      expect(xml).toContain(
        `<w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t xml:space="preserve">${title}</w:t>`
      );
    }
  });

  it('writes highlights as bullet points, and entries as Heading 2', () => {
    const highlight = resume.work[0]?.highlights[0] ?? '';
    const paragraph = xml
      .split('</w:p>')
      .find((p) => p.includes(`>${highlight}</w:t>`));
    expect(highlight).not.toBe('');
    expect(paragraph).toContain('<w:numPr>');
    expect(files.get('word/numbering.xml')).toContain(
      'w:numFmt w:val="bullet"'
    );
    expect(xml).toContain('<w:pStyle w:val="Heading2"/>');
  });

  it('writes dates as months, contact details and links', () => {
    expect(text).toContain('Mar 2021 – present');
    expect(text).toContain('Sep 2014 – May 2018');
    expect(text).toContain(resume.basics.email);
    expect(files.get('word/_rels/document.xml.rels')).toContain(
      `mailto:${resume.basics.email}`
    );
    expect(text).not.toContain('[object Object]');
  });

  it('copes with a sparse or odd resume', async () => {
    const sparse = plain(
      unzip(
        await toDocx({
          basics: { name: 'Ada' },
          work: [{ name: 'Engines', endDate: '1843' }, 'junk'],
          skills: 'not a list',
        })
      ).get('word/document.xml') ?? ''
    );
    expect(sparse).toContain('Ada');
    expect(sparse).toContain('Work experience');
    expect(sparse).toContain('until 1843');
    expect(sparse).not.toContain('Skills');
    expect(unzip(await toDocx({})).has('word/document.xml')).toBe(true);
  });
});
