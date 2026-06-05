/**
 * Check for ATS-friendly fonts
 */
export function checkFonts($) {
  const issues = [];
  let score = 15;

  const bodyText = $('body').text() || '';
  const styleText = $('style').text() || '';
  const inlineStyles = $('[style*="font"]').length;

  // Standard ATS-friendly fonts
  const goodFonts = [
    'helvetica',
    'arial',
    'calibri',
    'cambria',
    'georgia',
    'times new roman',
    'verdana',
    'tahoma',
    'trebuchet',
    '-apple-system',
    'system-ui',
    'segoe ui',
  ];

  const badFonts = [
    'comic sans',
    'papyrus',
    'brush script',
    'impact',
    'lucida handwriting',
    'chalkboard',
  ];

  // Check for bad fonts
  const foundBadFonts = badFonts.filter((font) =>
    styleText.toLowerCase().includes(font)
  );

  if (foundBadFonts.length > 0) {
    issues.push({
      severity: 'error',
      message: `Non-standard fonts detected: ${foundBadFonts.join(
        ', '
      )} - use standard fonts like Helvetica or Arial`,
    });
    score -= 10;
  }

  // Check for custom web fonts (can cause issues)
  if (
    styleText.includes('@font-face') ||
    styleText.includes('fonts.googleapis.com')
  ) {
    issues.push({
      severity: 'warning',
      message:
        'Custom web fonts detected - may not render in ATS systems, ensure fallback fonts are specified',
    });
    score -= 3;
  }

  // Check if any good fonts are specified
  const hasGoodFonts = goodFonts.some((font) =>
    styleText.toLowerCase().includes(font)
  );

  if (!hasGoodFonts && bodyText.length > 0) {
    issues.push({
      severity: 'warning',
      message: 'No standard ATS-friendly fonts detected in CSS',
    });
    score -= 5;
  }

  return {
    name: 'ATS-Friendly Fonts',
    score,
    maxScore: 15,
    passed: score >= 10,
    issues,
  };
}
