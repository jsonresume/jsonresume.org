import { Effect, Exit } from 'effect';
import { describe, expect, it } from 'vitest';
import { leaves } from './clean';
import { score } from './confidence';
import { csvRecords, parseCsv } from './csv';
import { isoDate } from './dates';
import { detect } from './detect';
import { docxText, pdfText } from './extract';
import { fromLinkedIn } from './linkedin';
import { repair } from './repair';
import {
  linkedInExport,
  RESUME_LINES,
  textPdf,
  wordDocx,
  zip,
} from './test/fixtures';

const run = <A, E>(effect: Effect.Effect<A, E>) => Effect.runPromise(effect);
const failure = async <A, E>(effect: Effect.Effect<A, E>) => {
  const exit = await Effect.runPromiseExit(effect);
  if (Exit.isSuccess(exit)) throw new Error('expected a failure');
  return JSON.stringify(exit.cause);
};

describe('isoDate', () => {
  it('reads the ways resumes write dates', () => {
    expect(isoDate('2020-02-31')).toBeUndefined();
    expect(isoDate('31 Feb 2020')).toBeUndefined();
    expect(isoDate('29 Feb 2020')).toBe('2020-02-29');
    expect(isoDate('2020')).toBe('2020');
    expect(isoDate('2020-03')).toBe('2020-03');
    expect(isoDate('Jan 2020')).toBe('2020-01');
    expect(isoDate('September 2019')).toBe('2019-09');
    expect(isoDate('Sept. 2019')).toBe('2019-09');
    expect(isoDate('03/2021')).toBe('2021-03');
    expect(isoDate('2021/3')).toBe('2021-03');
    expect(isoDate('15 Jan 2020')).toBe('2020-01-15');
    expect(isoDate('Jan 15, 2020')).toBe('2020-01-15');
  });
  it('gives up on what is not a date', () => {
    expect(isoDate('Present')).toBeUndefined();
    expect(isoDate('Summer')).toBeUndefined();
    expect(isoDate('13/2020')).toBeUndefined();
  });
});

describe('CSV', () => {
  it('reads quotes, doubled quotes and newlines in fields', () => {
    expect(parseCsv('a,b\r\n"x, y","say ""hi""\nthere"\n')).toEqual([
      ['a', 'b'],
      ['x, y', 'say "hi"\nthere'],
    ]);
  });
  it('finds the header under LinkedIn’s notes', () => {
    const text =
      'Notes:\n"Something"\n\nFirst Name,URL\nAda,https://a.example\n';
    expect(csvRecords(text, 'First Name')).toEqual([
      { 'First Name': 'Ada', URL: 'https://a.example' },
    ]);
  });
});

describe('detect', () => {
  it('knows a PDF, a Word document, a LinkedIn export and text by their bytes', async () => {
    expect((await run(detect({ bytes: textPdf(['Hi']) }))).kind).toBe('pdf');
    const docx = await wordDocx(['Hi']);
    expect((await run(detect({ bytes: docx, name: 'cv.pdf' }))).kind).toBe(
      'docx'
    );
    expect((await run(detect({ bytes: linkedInExport() }))).kind).toBe(
      'linkedin'
    );
    const text = await run(detect({ bytes: new TextEncoder().encode('Ada') }));
    expect(text).toEqual({ kind: 'text', text: 'Ada' });
  });

  it('refuses old Word files, images, other zips and binary', async () => {
    const doc = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 1, 2]);
    expect(await failure(detect({ bytes: doc }))).toContain('.docx or PDF');
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0]);
    expect(await failure(detect({ bytes: png }))).toContain('image');
    const other = zip({ 'notes.txt': 'hello' });
    expect(await failure(detect({ bytes: other }))).toContain('LinkedIn');
    const binary = new Uint8Array([0xff, 0xfe, 0x00, 0x81]);
    expect(await failure(detect({ bytes: binary }))).toContain(
      'UnsupportedImport'
    );
  });
});

describe('text from files', () => {
  it('reads a text PDF', async () => {
    const text = await run(pdfText(textPdf(RESUME_LINES)));
    expect(text).toContain('Ada Lovelace');
    expect(text).toContain('Computed Bernoulli numbers');
  });

  it('says a PDF without text is probably a scan', async () => {
    expect(await failure(pdfText(textPdf([])))).toContain('scan');
  });

  it('refuses a broken PDF', async () => {
    const broken = new TextEncoder().encode('%PDF-1.4\nnot really');
    expect(await failure(pdfText(broken))).toContain('UnsupportedImport');
  });

  it('reads a Word document', async () => {
    const text = await run(docxText(await wordDocx(RESUME_LINES)));
    expect(text.split('\n')).toEqual(expect.arrayContaining(RESUME_LINES));
  });
});

describe('LinkedIn export', () => {
  it('maps the CSVs to a resume without a model', async () => {
    const source = await run(detect({ bytes: linkedInExport() }));
    if (source.kind !== 'linkedin') throw new Error(source.kind);
    const { resume } = score(fromLinkedIn(source.files).resume, []);
    expect(resume).toEqual({
      basics: {
        name: 'Ada Lovelace',
        label: 'Analytical Engineer, Mathematics',
        email: 'ada@example.com',
        url: 'https://ada.example.com',
        summary: 'Writes programs for engines.\nLikes poetry.',
        location: { city: 'London', region: 'England' },
        profiles: [{ network: 'X', username: 'ada', url: 'https://x.com/ada' }],
      },
      work: [
        {
          name: 'Analytical Engines Ltd',
          position: 'Programmer',
          location: 'London, UK',
          startDate: '1842-01',
          endDate: '1843-09',
          summary: 'Wrote the first program.',
          highlights: [
            'Computed Bernoulli numbers',
            'Annotated the Menabrea paper',
          ],
        },
        { name: 'Babbage & Co', position: 'Assistant', startDate: '1840' },
      ],
      education: [
        {
          institution: 'Home schooling',
          studyType: 'Mathematics',
          startDate: '1820',
          endDate: '1832',
        },
      ],
      skills: [{ name: 'Mathematics' }, { name: 'Programming' }],
      languages: [
        { language: 'French', fluency: 'Professional working proficiency' },
      ],
    });
  });
});

describe('repair and confidence', () => {
  it('rewrites values whose meaning is plain and drops the rest', () => {
    const { resume, warnings, changed } = repair({
      basics: { name: 'Ada', email: 'ada at example', url: 'ada.dev' },
      work: [
        { name: 'A', startDate: 'March 2020', endDate: 'Present', url: 'n/a' },
      ],
    });
    expect(resume).toEqual({
      basics: { name: 'Ada', url: 'https://ada.dev' },
      work: [{ name: 'A', startDate: '2020-03' }],
    });
    expect(warnings).toEqual([
      'Left out work › 0 › url: Should be a full URL, starting with https://',
      'Left out work › 0 › endDate: Use a date like 2024-06-30, 2024-06 or 2024.',
      'Left out basics › email: Should be an email address.',
    ]);
    expect([...changed].sort()).toEqual(['/basics/url', '/work/0/startDate']);
  });

  it('scores every field: high, unless unsure or rewritten', () => {
    const scored = score(
      {
        basics: { name: 'Ada', location: { city: 'London', region: 'X' } },
        work: [{ name: 'A', startDate: 'Jan 2020', highlights: ['One'] }],
      },
      [
        { path: '/basics/location', confidence: 'medium' },
        { path: '/basics/location/region', confidence: 'low' },
      ]
    );
    expect(scored.confidence).toEqual({
      '/basics/name': 'high',
      '/basics/location/city': 'medium',
      '/basics/location/region': 'low',
      '/work/0/name': 'high',
      '/work/0/startDate': 'medium',
      '/work/0/highlights/0': 'high',
    });
    expect(scored.fields).toBe(6);
    expect(leaves({ 'a/b': ['x'] })).toEqual(['/a~1b/0']);
  });
});
