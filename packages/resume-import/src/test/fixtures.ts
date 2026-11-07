import { Document, Packer, Paragraph } from 'docx';
import { strToU8, zipSync } from 'fflate';

/**
 * A one-page PDF with the lines given as real text (Helvetica), built by
 * hand so the tests need no binary fixtures. No lines makes a PDF with no
 * text at all, as a scan is.
 */
export const textPdf = (lines: ReadonlyArray<string>): Uint8Array => {
  const escape = (s: string) => s.replace(/([\\()])/g, '\\$1');
  const content = lines.length
    ? `BT /F1 12 Tf 72 720 Td 16 TL ${lines
        .map((l) => `(${escape(l)}) Tj T*`)
        .join(' ')} ET`
    : '';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .map((o) => `${String(o).padStart(10, '0')} 00000 n \n`)
    .join('');
  pdf += `trailer\n<< /Size ${
    objects.length + 1
  } /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
};

/** A Word document (.docx) with one paragraph per line. */
export const wordDocx = async (lines: ReadonlyArray<string>) => {
  const doc = new Document({
    sections: [{ children: lines.map((l) => new Paragraph(l)) }],
  });
  return new Uint8Array(await Packer.toBuffer(doc));
};

/** A zip of the files given, as a LinkedIn data export is. */
export const zip = (files: Record<string, string>) =>
  zipSync(
    Object.fromEntries(
      Object.entries(files).map(([name, text]) => [name, strToU8(text)])
    )
  );

/** A small LinkedIn data export, with the quirks of the real one. */
export const linkedInExport = () =>
  zip({
    'Profile.csv':
      'First Name,Last Name,Maiden Name,Address,Birth Date,Headline,Summary,Industry,Zip Code,Geo Location,Twitter Handles,Websites,Instant Messengers\n' +
      'Ada,Lovelace,,,,"Analytical Engineer, Mathematics","Writes programs for engines.\nLikes poetry.",Computing,,"London, England, United Kingdom",[ada],[PORTFOLIO:https://ada.example.com],\n',
    'Positions.csv':
      'Company Name,Title,Description,Location,Started On,Finished On\n' +
      'Analytical Engines Ltd,Programmer,"Wrote the first program.\n• Computed Bernoulli numbers\n• Annotated the Menabrea paper","London, UK",Jan 1842,Sep 1843\n' +
      'Babbage & Co,Assistant,,,1840,\n',
    'Education.csv':
      'School Name,Start Date,End Date,Notes,Degree Name,Activities\n' +
      'Home schooling,1820,1832,,Mathematics,\n',
    'Skills.csv': 'Name\nMathematics\nProgramming\n',
    'Languages.csv':
      'Name,Proficiency\nFrench,Professional working proficiency\n',
    'Email Addresses.csv':
      'Email Address,Confirmed,Primary,Updated On\nold@example.com,Yes,No,1/1/20\nada@example.com,Yes,Yes,1/2/20\n',
    'Connections.csv':
      'Notes:\n"When exporting your connection data, you may notice..."\n\nFirst Name,Last Name,URL\nCharles,Babbage,https://www.linkedin.com/in/cb\n',
  });

export const RESUME_LINES = [
  'Ada Lovelace',
  'Analytical Engineer',
  'ada@example.com | London',
  'Experience',
  'Analytical Engines Ltd, Programmer, Jan 1842 - Sep 1843',
  '- Computed Bernoulli numbers on the engine',
];
