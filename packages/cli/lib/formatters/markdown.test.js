import toMarkdown from './markdown';

const sample = require('@jsonresume/schema/sample.resume.json');

describe('markdown formatter', () => {
  describe('against the bundled sample resume', () => {
    let md;
    beforeAll(() => {
      md = toMarkdown(sample);
    });

    it('returns a non-empty string ending in a newline', () => {
      expect(typeof md).toBe('string');
      expect(md.length).toBeGreaterThan(0);
      expect(md.endsWith('\n')).toBe(true);
    });

    it('renders the person name as the top-level heading', () => {
      expect(md).toContain('# Richard Hendriks');
    });

    it('renders a heading for every populated section', () => {
      [
        '## Work',
        '## Volunteer',
        '## Education',
        '## Awards',
        '## Publications',
        '## Skills',
        '## Languages',
        '## Interests',
        '## References',
        '## Projects',
      ].forEach((heading) => {
        expect(md).toContain(heading);
      });
    });

    it('renders entry details, highlights and keywords', () => {
      expect(md).toContain('Pied Piper');
      expect(md).toContain('CEO/President');
      expect(md).toContain('- Successfully won Techcrunch Disrupt');
      expect(md).toContain('University of Oklahoma');
      expect(md).toContain('Miss Direction');
      expect(md).toContain('HTML, CSS, Javascript');
      expect(md).toContain('English — Native speaker');
    });

    it('links urls using markdown link syntax', () => {
      expect(md).toContain('](http://piedpiper.example.com)');
    });
  });

  describe('with missing / partial sections', () => {
    it('handles an empty resume without throwing', () => {
      expect(() => toMarkdown({})).not.toThrow();
      expect(() => toMarkdown()).not.toThrow();
    });

    it('omits sections that are absent', () => {
      const md = toMarkdown({ basics: { name: 'Jane Doe' } });
      expect(md).toContain('# Jane Doe');
      expect(md).not.toContain('## Work');
      expect(md).not.toContain('## Skills');
    });

    it('omits sections that are present but empty', () => {
      const md = toMarkdown({ basics: { name: 'Jane Doe' }, work: [] });
      expect(md).not.toContain('## Work');
    });
  });
});
