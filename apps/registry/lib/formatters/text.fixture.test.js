import { describe, it, expect } from 'vitest';
import { completeResume } from '@jsonresume/sample-data';
import textFormatter from './text';

/**
 * Characterization tests for the plain-text formatter (text.js) exercised
 * against the real packages/test-fixtures/complete-resume.json fixture (every
 * JSON Resume section populated) plus targeted edge cases for the internal
 * formatSection() merge/exclude logic. text.js is a pure, DB/network-free
 * formatter; these lock in CURRENT behavior. See themeRenderQa.test.js for the
 * theme-render gate that uses the same fixture.
 */

const SECTION_ORDER = [
  'PROFESSIONAL SUMMARY',
  'WORK HISTORY',
  'VOLUNTEER',
  'PROJECTS',
  'EDUCATION',
  'AWARDS',
  'CERTIFICATES',
  'PUBLICATIONS',
  'SKILLS',
];

describe('text formatter against complete-resume fixture', () => {
  it('returns content string and empty headers', async () => {
    const { content, headers } = await textFormatter.format(completeResume);
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    expect(headers).toEqual([]);
  });

  it('renders the header block first (name, label, contact)', async () => {
    const { content } = await textFormatter.format(completeResume);
    const lines = content.split('\n');
    expect(lines[0]).toBe('Jane Developer');
    expect(lines[1]).toBe('Full Stack Software Engineer');
    // contact fields from basics.location/phone/email appear before the
    // first section separator.
    const summaryIndex = content.indexOf('PROFESSIONAL SUMMARY');
    const headerBlock = content.slice(0, summaryIndex);
    expect(headerBlock).toContain('San Francisco');
    expect(headerBlock).toContain('California');
    expect(headerBlock).toContain('jane.developer@example.com');
    expect(headerBlock).toContain('(555) 123-4567');
  });

  it('renders every populated section heading', async () => {
    const { content } = await textFormatter.format(completeResume);
    for (const heading of SECTION_ORDER) {
      expect(content, `missing section heading "${heading}"`).toContain(
        heading
      );
    }
  });

  it('emits all sections in the fixed content() order', async () => {
    const { content } = await textFormatter.format(completeResume);
    const positions = SECTION_ORDER.map((h) => content.indexOf(h));
    // every section present (no -1)
    expect(positions.every((p) => p >= 0)).toBe(true);
    // strictly increasing positions => correct order
    const sorted = [...positions].sort((a, b) => a - b);
    expect(positions).toEqual(sorted);
  });

  it('uses the "============================" separator under each heading', async () => {
    const { content } = await textFormatter.format(completeResume);
    expect(content).toContain('============================');
    // the line immediately after WORK HISTORY is the separator
    const lines = content.split('\n');
    const workIdx = lines.indexOf('WORK HISTORY');
    expect(workIdx).toBeGreaterThan(-1);
    expect(lines[workIdx + 1]).toBe('============================');
  });

  it('renders work history with merged date line and summary', async () => {
    const { content } = await textFormatter.format(completeResume);
    const work = content.split('WORK HISTORY')[1];
    expect(work).toContain('TechCorp Inc');
    expect(work).toContain('Senior Software Engineer');
    expect(work).toContain('microservices architecture serving');
  });

  it('renders highlight arrays as "+ " bullet lines', async () => {
    const { content } = await textFormatter.format(completeResume);
    expect(content).toContain(
      '+ Architected and implemented new microservices platform using Node.js and Kubernetes'
    );
    expect(content).toContain('+ Reduced API response time by 40%');
  });

  it('renders volunteer, projects and education content', async () => {
    const { content } = await textFormatter.format(completeResume);
    expect(content).toContain('Code for America');
    expect(content).toContain('Open Source UI Library');
    expect(content).toContain('University of California, Berkeley');
  });

  it('renders awards, certificates and publications content', async () => {
    const { content } = await textFormatter.format(completeResume);
    expect(content).toContain('Top Contributor Award');
    expect(content).toContain('AWS Certified Solutions Architect');
    expect(content).toContain('Scaling Microservices Without Losing Your Mind');
  });

  it('renders skills with keyword bullets', async () => {
    const { content } = await textFormatter.format(completeResume);
    expect(content).toContain('PostgreSQL');
  });

  it('does NOT render languages/interests/references (no text section)', async () => {
    // text.js content() only wires up summary/work/volunteer/projects/
    // education/awards/certificates/publications/skills. languages,
    // interests and references have no formatSection call.
    const { content } = await textFormatter.format(completeResume);
    expect(content).not.toContain('LANGUAGES');
    expect(content).not.toContain('INTERESTS');
    expect(content).not.toContain('REFERENCES');
  });
});

describe('text formatter formatSection merge/exclude behavior', () => {
  it('joins both work dates as "startDate - endDate" when both present', async () => {
    const resume = {
      basics: { name: 'N', location: {} },
      work: [
        {
          name: 'Co',
          position: 'Dev',
          startDate: '2020-01',
          endDate: '2022-12',
          summary: 'did things',
        },
      ],
    };
    const { content } = await textFormatter.format(resume);
    expect(content).toContain('2020-01 - 2022-12');
  });

  it('uses only startDate in merge line when endDate is absent', async () => {
    const resume = {
      basics: { name: 'N', location: {} },
      work: [{ name: 'Co', position: 'Dev', startDate: '2020-01' }],
    };
    const { content } = await textFormatter.format(resume);
    const work = content.split('WORK HISTORY')[1].split('\n');
    // merge line is "2020-01" (no trailing " - ")
    expect(work).toContain('2020-01');
    expect(content).not.toContain('2020-01 - ');
  });

  it('merges awards as "title - date"', async () => {
    const resume = {
      basics: { name: 'N', location: {} },
      awards: [{ title: 'Best', date: '2023', awarder: 'ACME' }],
    };
    const { content } = await textFormatter.format(resume);
    expect(content).toContain('Best - 2023');
    expect(content).toContain('ACME');
  });

  it('excludes the "type" key from rendered output', async () => {
    const resume = {
      basics: { name: 'N', location: {} },
      work: [
        {
          name: 'Co',
          position: 'Dev',
          type: 'full-time',
          startDate: '2020-01',
          endDate: '2021-01',
        },
      ],
    };
    const { content } = await textFormatter.format(resume);
    expect(content).not.toContain('full-time');
  });

  it('does not emit a merge line for sections without mergedKeys (skills)', async () => {
    const resume = {
      basics: { name: 'N', location: {} },
      skills: [{ name: 'JavaScript', keywords: ['React', 'Node.js'] }],
    };
    const { content } = await textFormatter.format(resume);
    const skills = content.split('SKILLS')[1].split('\n').filter(Boolean);
    // first non-empty content line under separator is the value "JavaScript",
    // followed by "+ React" / "+ Node.js" bullets — no "X - Y" merge line.
    expect(skills).toContain('JavaScript');
    expect(skills).toContain('+ React');
    expect(skills).toContain('+ Node.js');
  });

  it('skips undefined/null/empty-string item values', async () => {
    const resume = {
      basics: { name: 'N', location: {} },
      work: [
        {
          name: 'Co',
          position: undefined,
          url: null,
          summary: '',
          startDate: '2020',
          endDate: '2021',
        },
      ],
    };
    const { content } = await textFormatter.format(resume);
    expect(content).toContain('Co');
    // null/undefined/empty must NOT leak as literal artifacts
    expect(content).not.toContain('null');
    expect(content).not.toContain('undefined');
  });

  it('omits a section entirely when its array is empty', async () => {
    const resume = {
      basics: { name: 'N', location: {} },
      work: [],
      awards: [],
      skills: [],
    };
    const { content } = await textFormatter.format(resume);
    expect(content).not.toContain('WORK HISTORY');
    expect(content).not.toContain('AWARDS');
    expect(content).not.toContain('SKILLS');
  });

  it('omits a section when the array is missing (undefined)', async () => {
    const resume = { basics: { name: 'N', location: {} } };
    const { content } = await textFormatter.format(resume);
    for (const heading of SECTION_ORDER.filter(
      (h) => h !== 'PROFESSIONAL SUMMARY'
    )) {
      expect(content).not.toContain(heading);
    }
  });

  it('omits PROFESSIONAL SUMMARY when basics.summary is undefined', async () => {
    const resume = { basics: { name: 'N', location: {} } };
    const { content } = await textFormatter.format(resume);
    expect(content).not.toContain('PROFESSIONAL SUMMARY');
  });

  it('filters undefined header fields (name only, no blank lines)', async () => {
    const resume = { basics: { name: 'OnlyName', location: {} } };
    const { content } = await textFormatter.format(resume);
    // with summary undefined the entire output is just the name.
    expect(content).toBe('OnlyName');
  });

  it('renders array values as "+ value" for any section field', async () => {
    const resume = {
      basics: { name: 'N', location: {} },
      projects: [
        {
          name: 'Proj',
          startDate: '2021',
          endDate: '2022',
          keywords: ['react', 'graphql'],
        },
      ],
    };
    const { content } = await textFormatter.format(resume);
    expect(content).toContain('+ react');
    expect(content).toContain('+ graphql');
  });
});
