import complete from '@jsonresume/sample-data/complete-resume.json';
import { SaxesParser } from 'saxes';
import { describe, expect, it } from 'vitest';
import { toDocx } from './docx';
import type { Entry } from './read';
import { unzip } from './testing';

const long = 'Led a cross-functional programme across four regions. '.repeat(
  80
);

/** Everything that tends to break a Word file, in one resume. */
const edge: Entry = {
  basics: {
    name: 'محمد عبد الله',
    label: 'مهندس برمجيات',
    email: 'mohammed@example.com',
    summary: `Ünïcödé naïve café, 日本語, 한국어, Ελληνικά, 🚀, ∑√ ${long}`,
    location: { city: 'دبي', countryCode: 'AE' },
    profiles: [],
  },
  work: [
    {
      name: 'شركة التقنية',
      position: 'Lead',
      startDate: '2020-01',
      highlights: [long, 'x'.repeat(400), ''],
    },
    {},
  ],
  education: [],
  volunteer: [],
  projects: [],
  skills: [{ name: 'Languages', keywords: [] }, { keywords: ['Rust'] }],
  awards: [{}],
  publications: [{ name: '<script>alert(1)</script> & "quotes" \'apos\'' }],
  references: [{ name: 'ישראל ישראלי', reference: 'מצוין' }],
  // Pasted from a PDF: control characters XML forbids.
  interests: [{ name: 'Chess\u000Band\u0007 Go\u0000', keywords: ['￾'] }],
};

/** Throws on anything that isn't well-formed XML 1.0. */
const parse = (xml: string) => new SaxesParser().write(xml).close();

const attributes = (xml: string, tag: string, attribute: string) =>
  [...xml.matchAll(new RegExp(`<${tag} [^>]*${attribute}="([^"]*)"`, 'g'))]
    .map((match) => match[1] ?? '')
    .filter(Boolean);

const cases = [
  ['the complete sample on A4', complete, 'a4', [11906, 16838]],
  ['the complete sample on Letter', complete, 'letter', [12240, 15840]],
  ['an edge-case resume', edge, 'a4', [11906, 16838]],
] as const;

describe.each(cases)('the .docx of %s', (_, resume, paper, [w, h]) => {
  const read = async () => unzip(await toDocx(resume, paper));

  it('has every part Word needs, each declared and well-formed', async () => {
    const files = await read();
    for (const part of [
      '[Content_Types].xml',
      '_rels/.rels',
      'docProps/core.xml',
      'word/document.xml',
      'word/styles.xml',
      'word/numbering.xml',
      'word/settings.xml',
      'word/_rels/document.xml.rels',
    ])
      expect(files.has(part), part).toBe(true);
    const types = files.get('[Content_Types].xml') ?? '';
    const defaults = attributes(types, 'Default', 'Extension');
    const overrides = attributes(types, 'Override', 'PartName');
    for (const [name, content] of files) {
      if (!/\.(xml|rels)$/.test(name)) continue;
      expect(() => parse(content), name).not.toThrow();
      const declared =
        overrides.includes(`/${name}`) ||
        defaults.includes(name.split('.').pop() ?? '');
      expect(declared, name).toBe(true);
    }
    expect(files.get('_rels/.rels')).toMatch(
      /Type="[^"]+\/officeDocument" Target="\/?word\/document\.xml"/
    );
  });

  it('links only to parts it contains, or out to the web and mail', async () => {
    const files = await read();
    const rels = files.get('word/_rels/document.xml.rels') ?? '';
    for (const [, attrs = ''] of rels.matchAll(/<Relationship ([^>]+)>/g)) {
      const target = /Target="([^"]+)"/.exec(attrs)?.[1] ?? '';
      if (attrs.includes('TargetMode="External"'))
        expect(target).toMatch(/^(https?:|mailto:)/);
      else expect(files.has(`word/${target}`), target).toBe(true);
    }
  });

  it('defines every style and list it uses', async () => {
    const files = await read();
    const xml = files.get('word/document.xml') ?? '';
    const defined = attributes(
      files.get('word/styles.xml') ?? '',
      'w:style',
      'w:styleId'
    );
    const used = [
      ...attributes(xml, 'w:pStyle', 'w:val'),
      ...attributes(xml, 'w:rStyle', 'w:val'),
    ];
    expect(used.length).toBeGreaterThan(0);
    for (const style of new Set(used)) expect(defined).toContain(style);
    const lists = attributes(
      files.get('word/numbering.xml') ?? '',
      'w:num',
      'w:numId'
    );
    for (const id of new Set(attributes(xml, 'w:numId', 'w:val')))
      expect(lists).toContain(id);
  });

  it(`is set on ${paper} paper`, async () => {
    const xml = (await read()).get('word/document.xml') ?? '';
    expect(xml).toMatch(new RegExp(`<w:pgSz w:w="${w}" w:h="${h}"`));
  });
});

describe('the edge-case .docx', async () => {
  const files = unzip(await toDocx(edge));
  const xml = files.get('word/document.xml') ?? '';
  const paragraph = (text: string) =>
    xml.split('</w:p>').find((p) => p.includes(text)) ?? '';

  it('runs Arabic and Hebrew paragraphs right to left, others left to right', () => {
    expect(paragraph('محمد عبد الله')).toContain('<w:bidi/>');
    expect(paragraph('محمد عبد الله')).toContain('w:val="Title"');
    expect(paragraph('מצוין')).toContain('<w:bidi/>');
    expect(paragraph('Ünïcödé')).not.toContain('<w:bidi');
    expect(files.get('word/styles.xml')).toContain('w:cs="Arial"');
  });

  it('keeps every character XML allows, and the long text whole', () => {
    expect(xml).toContain('日本語, 한국어, Ελληνικά, 🚀, ∑√');
    expect(xml).toContain('x'.repeat(400));
    expect(xml.split(long.trim()).length).toBeGreaterThan(2);
    expect(xml).toContain(
      '&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;quotes&quot; &apos;apos&apos;'
    );
    expect(xml).toContain('Chess and Go');
  });

  it('leaves out empty sections and entries', () => {
    for (const title of ['Education', 'Projects', 'Volunteering', 'Awards'])
      expect(xml).not.toContain(`>${title}</w:t>`);
    expect(xml).not.toContain('<w:t xml:space="preserve"></w:t>');
  });
});
