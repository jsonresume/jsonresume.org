/**
 * Check for icon fonts, emoji and decorative special characters.
 *
 * ATS parsers extract plain text. Icon fonts (Font Awesome, Material Icons,
 * Bootstrap glyphicons) render glyphs from a private-use Unicode area, so the
 * parser either drops them or extracts garbage characters that pollute the
 * indexed text. Emoji and ornamental symbols used as bullets or section
 * markers cause the same problem and can split words the ATS is matching on.
 */

// Icon-font class tokens commonly placed on empty <i>/<span> elements.
// Matched as whole space-delimited class tokens (exact, or `<token>-*`) so we
// do not accidentally match unrelated classes like "fancy" or "biography".
export const ICON_FONT_TOKENS = [
  'fa', // Font Awesome base
  'fas', // Font Awesome solid
  'far', // Font Awesome regular
  'fab', // Font Awesome brands
  'fal', // Font Awesome light
  'glyphicon', // Bootstrap
  'material-icons', // Material Icons
  'material-symbols', // Material Symbols
  'bi', // Bootstrap Icons
  'mdi', // Material Design Icons
  'icon', // generic icomoon-style (icon, icon-*)
];

// Icon-font families referenced from CSS.
export const ICON_FONT_FAMILIES = [
  'font awesome',
  'fontawesome',
  'material icons',
  'material symbols',
  'glyphicons',
  'bootstrap-icons',
  'icomoon',
];

// Emoji + common decorative/dingbat ranges. Kept narrow so ordinary
// punctuation (bullets •, en/em dashes, smart quotes) is NOT flagged — those
// are well supported by ATS parsers.
export const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu;

// Private Use Area code points — where icon fonts map their glyphs. Real text
// never contains these, so any occurrence is a strong icon-font signal.
export const PRIVATE_USE_RE = /[\u{E000}-\u{F8FF}\u{F0000}-\u{FFFFD}]/u;

export function checkSpecialCharacters($) {
  const issues = [];
  let score = 10;

  // 1. Icon-font CSS classes on elements. Inspect each element's class list and
  //    flag any token that exactly matches a known icon token or is a
  //    `<token>-*` variant (e.g. fa-envelope, icon-phone).
  const iconTokenSet = new Set(ICON_FONT_TOKENS);
  let iconElCount = 0;
  $('[class]').each((i, el) => {
    const classAttr = $(el).attr('class') || '';
    const tokens = classAttr.split(/\s+/).filter(Boolean);
    const isIcon = tokens.some((t) => {
      if (iconTokenSet.has(t)) return true;
      const prefix = t.includes('-') ? t.slice(0, t.indexOf('-')) : null;
      return prefix !== null && iconTokenSet.has(prefix);
    });
    if (isIcon) iconElCount += 1;
  });
  if (iconElCount > 0) {
    issues.push({
      severity: 'warning',
      message: `Icon fonts detected (${iconElCount} element(s) using Font Awesome / Material / glyphicon-style classes) - ATS parsers cannot read icon glyphs; pair every icon with adjacent text.`,
    });
    score -= 3;
  }

  // 2. Icon-font families referenced in CSS.
  const styleText = ($('style').text() || '').toLowerCase();
  const foundIconFamily = ICON_FONT_FAMILIES.some((f) => styleText.includes(f));
  if (foundIconFamily && iconElCount === 0) {
    issues.push({
      severity: 'info',
      message:
        'Icon-font family referenced in CSS - verify icons are decorative only and never carry meaning ATS needs.',
    });
    score -= 1;
  }

  const bodyText = $('body').text() || $.root().text() || '';

  // 3. Private Use Area characters in the extractable text (leaked icon glyphs).
  if (PRIVATE_USE_RE.test(bodyText)) {
    issues.push({
      severity: 'error',
      message:
        'Private-use Unicode characters found in text - these are icon-font glyphs that ATS systems extract as garbage; remove them or replace with real text.',
    });
    score -= 4;
  }

  // 4. Excessive emoji / dingbats in the body text.
  const emojiMatches = bodyText.match(EMOJI_RE) || [];
  if (emojiMatches.length > 3) {
    issues.push({
      severity: 'warning',
      message: `${emojiMatches.length} emoji/decorative symbols found in text - ATS parsers may drop or mangle them; avoid using them as bullets or section markers.`,
    });
    score -= 3;
  } else if (emojiMatches.length > 0) {
    issues.push({
      severity: 'info',
      message: `${emojiMatches.length} emoji/decorative symbol(s) found - keep resume text plain so ATS parsing stays clean.`,
    });
    score -= 1;
  }

  return {
    name: 'Special Characters',
    score: Math.max(0, score),
    maxScore: 10,
    passed: score >= 8,
    issues,
  };
}
