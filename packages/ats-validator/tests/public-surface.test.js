import { describe, it, expect } from 'vitest';
import { getGrade, validateATS, getRecommendations } from '../src/index.js';
import {
  ATS_FRIENDLY_FONTS,
  ATS_BAD_FONTS,
  ICON_FONT_TOKENS,
  ICON_FONT_FAMILIES,
  EMOJI_RE,
  PRIVATE_USE_RE,
  EMAIL_RE,
  PHONE_RE,
  countDigits,
} from '../src/constants.js';

describe('public getGrade export', () => {
  it('is exported from the package root', () => {
    expect(typeof getGrade).toBe('function');
  });

  it('maps percentages to letter grades A..F at the documented thresholds', () => {
    // A: >= 90
    expect(getGrade(100)).toBe('A');
    expect(getGrade(90)).toBe('A');
    // B: 80-89
    expect(getGrade(89)).toBe('B');
    expect(getGrade(80)).toBe('B');
    // C: 70-79
    expect(getGrade(79)).toBe('C');
    expect(getGrade(70)).toBe('C');
    // D: 60-69
    expect(getGrade(69)).toBe('D');
    expect(getGrade(60)).toBe('D');
    // F: < 60
    expect(getGrade(59)).toBe('F');
    expect(getGrade(0)).toBe('F');
  });

  it('matches the grade computed by validateATS', () => {
    const html = '<html lang="en"><body><h1>Test</h1></body></html>';
    const result = validateATS(html);
    expect(result.grade).toBe(getGrade(result.score));
  });
});

describe('./constants subpath exports', () => {
  it('still exposes the original validator entrypoints alongside', () => {
    expect(typeof validateATS).toBe('function');
    expect(typeof getRecommendations).toBe('function');
  });

  it('exposes non-empty, lowercase font tables', () => {
    expect(Array.isArray(ATS_FRIENDLY_FONTS)).toBe(true);
    expect(ATS_FRIENDLY_FONTS.length).toBeGreaterThan(0);
    expect(ATS_FRIENDLY_FONTS).toContain('arial');
    expect(ATS_FRIENDLY_FONTS).toContain('helvetica');
    expect(ATS_FRIENDLY_FONTS.every((f) => f === f.toLowerCase())).toBe(true);

    expect(Array.isArray(ATS_BAD_FONTS)).toBe(true);
    expect(ATS_BAD_FONTS.length).toBeGreaterThan(0);
    expect(ATS_BAD_FONTS).toContain('comic sans');
    expect(ATS_BAD_FONTS.every((f) => f === f.toLowerCase())).toBe(true);
  });

  it('exposes the icon-font token and family tables', () => {
    expect(Array.isArray(ICON_FONT_TOKENS)).toBe(true);
    expect(ICON_FONT_TOKENS.length).toBeGreaterThan(0);
    expect(ICON_FONT_TOKENS).toContain('fa');
    expect(ICON_FONT_TOKENS).toContain('material-icons');

    expect(Array.isArray(ICON_FONT_FAMILIES)).toBe(true);
    expect(ICON_FONT_FAMILIES.length).toBeGreaterThan(0);
    expect(ICON_FONT_FAMILIES).toContain('fontawesome');
  });

  it('exposes regexes with the expected shape', () => {
    expect(EMOJI_RE).toBeInstanceOf(RegExp);
    expect(EMOJI_RE.global).toBe(true); // stateful — used with match/matchAll
    expect(PRIVATE_USE_RE).toBeInstanceOf(RegExp);
    expect(EMAIL_RE).toBeInstanceOf(RegExp);
    expect(PHONE_RE).toBeInstanceOf(RegExp);
  });

  it('EMAIL_RE matches a real email and not plain prose', () => {
    expect(EMAIL_RE.test('jane.doe@example.com')).toBe(true);
    expect(EMAIL_RE.test('see me @ the office tomorrow')).toBe(false);
  });

  it('PRIVATE_USE_RE flags private-use glyphs but not ordinary text', () => {
    const glyph = String.fromCharCode(0xe001);
    expect(PRIVATE_USE_RE.test(`Contact ${glyph}`)).toBe(true);
    expect(PRIVATE_USE_RE.test('Plain resume text')).toBe(false);
  });

  it('EMOJI_RE matches emoji via String#match', () => {
    expect('Skills 🚀 ✨'.match(EMOJI_RE)?.length).toBeGreaterThan(0);
    expect('plain text — no emoji'.match(EMOJI_RE)).toBeNull();
  });

  it('countDigits counts only digit characters', () => {
    expect(typeof countDigits).toBe('function');
    expect(countDigits('+1 (555) 123-4567')).toBe(11);
    expect(countDigits('no digits here')).toBe(0);
  });

  it('constants are the same references the checks use (no duplication)', async () => {
    const fonts = await import('../src/checks/fonts.js');
    const special = await import('../src/checks/special-characters.js');
    const contact = await import('../src/checks/contact-info.js');
    expect(ATS_FRIENDLY_FONTS).toBe(fonts.ATS_FRIENDLY_FONTS);
    expect(ATS_BAD_FONTS).toBe(fonts.ATS_BAD_FONTS);
    expect(ICON_FONT_TOKENS).toBe(special.ICON_FONT_TOKENS);
    expect(EMAIL_RE).toBe(contact.EMAIL_RE);
  });
});
