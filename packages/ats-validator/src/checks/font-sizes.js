/**
 * Check font sizes
 */
export function checkFontSizes($) {
  const issues = [];
  let score = 10;

  const styleText = $('style').text() || '';

  // Check for very small fonts (< 10px)
  const smallFonts = styleText.match(/font-size:\s*([0-9]+)px/gi) || [];
  const tooSmall = smallFonts.filter((match) => {
    const size = parseInt(match.match(/[0-9]+/)[0]);
    return size < 10;
  });

  if (tooSmall.length > 0) {
    issues.push({
      severity: 'warning',
      message:
        'Font sizes below 10px detected - may be difficult for ATS to parse and humans to read',
    });
    score -= 3;
  }

  // Check for very large fonts (> 50px for body text)
  const largeFonts = smallFonts.filter((match) => {
    const size = parseInt(match.match(/[0-9]+/)[0]);
    return size > 50;
  });

  if (largeFonts.length > 1) {
    issues.push({
      severity: 'info',
      message:
        'Multiple very large font sizes (>50px) - ensure hierarchy is clear',
    });
    score -= 1;
  }

  return {
    name: 'Font Sizes',
    score,
    maxScore: 10,
    passed: score >= 8,
    issues,
  };
}
