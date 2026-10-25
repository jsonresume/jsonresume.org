import resume from '@jsonresume/sample-data/complete-resume.json';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { formatResume } from './formats';
import { qrPng } from './qr';
import { toRenderCv } from './rendercv';
import { toText } from './text';

describe('formatResume', () => {
  it('serves JSON as given, indented', () => {
    const { body, contentType } = formatResume('json', resume);
    expect(JSON.parse(body)).toEqual(resume);
    expect(contentType).toBe('application/json; charset=utf-8');
  });

  it('serves YAML that reads back to the same resume', () => {
    expect(parse(formatResume('yaml', resume).body)).toEqual(resume);
  });
});

describe('toText', () => {
  const output = toText(resume);

  it('starts with the name and has every section with entries', () => {
    expect(output.startsWith(`${resume.basics.name}\n`)).toBe(true);
    for (const title of [
      'SUMMARY',
      'WORK',
      'EDUCATION',
      'SKILLS',
      'LANGUAGES',
    ]) {
      expect(output).toContain(`${title}\n${'='.repeat(title.length)}`);
    }
  });

  it('writes structured locations and dates as text', () => {
    expect(output).not.toContain('[object Object]');
    const job = resume.work[0];
    expect(output).toContain(
      `${job?.startDate} – ${job?.endDate ?? 'present'}`
    );
  });

  it('copes with a sparse or odd resume', () => {
    expect(
      toText({
        basics: {
          name: 'Ada',
          location: { city: 'London', countryCode: 'GB' },
        },
        work: [{ name: 'Engines', endDate: '1843' }, 'junk'],
        skills: 'not a list',
      })
    ).toBe('Ada\nLondon, GB\n\nWORK\n====\n\nEngines\nuntil 1843\n');
    expect(toText({})).toBe('\n');
  });
});

describe('toRenderCv', () => {
  const cv = parse(formatResume('rendercv', resume).body).cv;

  it('carries the person and each section RenderCV has entries for', () => {
    expect(cv.name).toBe(resume.basics.name);
    expect(cv.sections.experience[0].company).toBe(resume.work[0]?.name);
    expect(cv.sections.education.length).toBe(resume.education.length);
    expect(cv.sections.skills[0]).toEqual({
      label: resume.skills[0]?.name,
      details: resume.skills[0]?.keywords.join(', '),
    });
  });

  it('keeps only networks, phones and dates RenderCV accepts', () => {
    const out = parse(
      toRenderCv({
        basics: {
          name: 'Ada',
          phone: '0400 000 000',
          profiles: [
            { network: 'Twitter', username: 'ada' },
            { network: 'Myspace', username: 'ada' },
          ],
        },
        work: [{ name: 'Engines', startDate: 'spring 1843' }],
        skills: [{ name: 'Maths' }],
      })
    ).cv;
    expect(out.phone).toBeUndefined();
    expect(out.social_networks).toEqual([{ network: 'X', username: 'ada' }]);
    expect(out.sections.experience).toEqual([{ company: 'Engines' }]);
    expect(out.sections.skills).toBeUndefined();
  });

  it('copes with an empty resume', () => {
    expect(parse(toRenderCv({}))).toEqual({ cv: {} });
  });
});

describe('qrPng', () => {
  it('draws a PNG', async () => {
    const png = await qrPng('https://jsonresume.org/@ada');
    expect([...png.slice(1, 4)].map((c) => String.fromCharCode(c))).toEqual([
      'P',
      'N',
      'G',
    ]);
  });
});
