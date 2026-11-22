import { describe, expect, it } from 'vitest';
import { resumeLanguage, withResumeLanguage } from './lang';

const page = (open: string) =>
  `<!doctype html>${open}<head></head><body>Ada</body></html>`;

describe('the resume language on the page', () => {
  it("replaces the theme's lang with the resume's meta.language", () => {
    const resume = { meta: { language: 'pt-BR' } };
    expect(withResumeLanguage(page('<html lang="en">'), resume)).toBe(
      page('<html lang="pt-BR">')
    );
    expect(withResumeLanguage(page("<html class='x' lang='en'>"), resume)).toBe(
      page('<html class=\'x\' lang="pt-BR">')
    );
    expect(withResumeLanguage(page('<html>'), resume)).toBe(
      page('<html lang="pt-BR">')
    );
  });

  it('leaves the page alone without a usable tag', () => {
    const html = page('<html lang="en">');
    expect(withResumeLanguage(html, {})).toBe(html);
    expect(withResumeLanguage(html, { meta: { language: 'English' } })).toBe(
      html
    );
    expect(withResumeLanguage(html, { meta: { language: '"><script>' } })).toBe(
      html
    );
    expect(resumeLanguage({ meta: { language: ' fr ' } })).toBe('fr');
    expect(resumeLanguage({ meta: { language: 7 } })).toBeUndefined();
    expect(resumeLanguage(null)).toBeUndefined();
  });
});
