import toText from './text';

const sample = require('@jsonresume/schema/sample.resume.json');

describe('text formatter', () => {
  describe('against the bundled sample resume', () => {
    let txt;
    beforeAll(() => {
      txt = toText(sample);
    });

    it('returns a non-empty string ending in a newline', () => {
      expect(typeof txt).toBe('string');
      expect(txt.length).toBeGreaterThan(0);
      expect(txt.endsWith('\n')).toBe(true);
    });

    it('renders the person name', () => {
      expect(txt).toContain('Richard Hendriks');
    });

    it('renders an underlined heading for every populated section', () => {
      [
        'WORK',
        'VOLUNTEER',
        'EDUCATION',
        'AWARDS',
        'PUBLICATIONS',
        'SKILLS',
        'LANGUAGES',
        'INTERESTS',
        'REFERENCES',
        'PROJECTS',
      ].forEach((heading) => {
        expect(txt).toContain(heading);
      });
      // headings are underlined with '=' rules
      expect(txt).toContain('====');
    });

    it('renders entry details, highlights and keywords', () => {
      expect(txt).toContain('CEO/President @ Pied Piper');
      expect(txt).toContain('  * Successfully won Techcrunch Disrupt');
      expect(txt).toContain('University of Oklahoma');
      expect(txt).toContain('Miss Direction');
      expect(txt).toContain('HTML, CSS, Javascript');
      expect(txt).toContain('English - Native speaker');
    });

    it('does not contain markdown markup', () => {
      expect(txt).not.toContain('# ');
      expect(txt).not.toContain('](');
    });
  });

  describe('with missing / partial sections', () => {
    it('handles an empty resume without throwing', () => {
      expect(() => toText({})).not.toThrow();
      expect(() => toText()).not.toThrow();
    });

    it('omits sections that are absent', () => {
      const txt = toText({ basics: { name: 'Jane Doe' } });
      expect(txt).toContain('Jane Doe');
      expect(txt).not.toContain('WORK');
      expect(txt).not.toContain('SKILLS');
    });

    it('omits sections that are present but empty', () => {
      const txt = toText({ basics: { name: 'Jane Doe' }, work: [] });
      expect(txt).not.toContain('WORK');
    });
  });
});
