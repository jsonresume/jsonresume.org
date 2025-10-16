/**
 * ATS Check: Theme Compatibility
 */

/**
 * Check theme ATS compatibility
 * @param {string} theme - Theme name
 * @returns {Object} Check result with score and issues
 */
export function checkThemeCompatibility(theme) {
  const issues = [];
  let score = 0;
  const maxScore = 5;

  // List of known ATS-friendly themes
  const atsFriendlyThemes = [
    'jsonresume-theme-stackoverflow',
    'jsonresume-theme-professional',
    'jsonresume-theme-elegant',
    'jsonresume-theme-kendall',
    'jsonresume-theme-flat',
  ];

  // List of themes with known ATS issues
  const atsProblematicThemes = [
    'jsonresume-theme-paper',
    'jsonresume-theme-short',
  ];

  const themeName = theme || '';

  if (atsFriendlyThemes.some((t) => themeName.includes(t))) {
    score = 5;
  } else if (atsProblematicThemes.some((t) => themeName.includes(t))) {
    score = 1;
    issues.push({
      severity: 'warning',
      category: 'theme',
      message: 'This theme may have ATS compatibility issues',
      fix: `Consider using ATS-friendly themes: ${atsFriendlyThemes.join(
        ', '
      )}`,
    });
  } else {
    score = 3; // Neutral score for unknown themes
    issues.push({
      severity: 'info',
      category: 'theme',
      message: 'Theme ATS compatibility unknown',
      fix: 'For best results, use a simple, single-column theme',
    });
  }

  return {
    name: 'Theme Compatibility',
    score,
    maxScore,
    issues,
    passed: score >= 3,
  };
}
