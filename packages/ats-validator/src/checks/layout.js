/**
 * Check for single-column layout
 */
export function checkLayout($) {
  const issues = [];
  let score = 15;

  const styleText = $('style').text() || '';

  // Check for multi-column CSS
  if (styleText.includes('column-count') || styleText.includes('columns:')) {
    issues.push({
      severity: 'warning',
      message:
        'Multi-column CSS detected - may confuse ATS parsers, prefer single-column layout',
    });
    score -= 5;
  }

  // Check for floats (often used for multi-column)
  const floatElements = styleText.match(/float:\s*(left|right)/gi);
  if (floatElements && floatElements.length > 2) {
    issues.push({
      severity: 'info',
      message:
        'Multiple floated elements detected - ensure content flows logically top-to-bottom',
    });
    score -= 3;
  }

  // Check for CSS Grid with multiple columns
  if (
    styleText.includes('grid-template-columns') &&
    styleText.match(/grid-template-columns:[^;]*\s+\S+\s+\S+/)
  ) {
    issues.push({
      severity: 'info',
      message:
        'CSS Grid with multiple columns detected - verify ATS can parse left-to-right, top-to-bottom',
    });
    score -= 2;
  }

  // Check for flexbox wrapping (can indicate multi-column)
  if (
    styleText.includes('flex-wrap') &&
    styleText.includes('justify-content: space-between')
  ) {
    issues.push({
      severity: 'info',
      message:
        'Flexbox layout detected - ensure content order is logical for screen readers and ATS',
    });
    score -= 2;
  }

  return {
    name: 'Single-Column Layout',
    score,
    maxScore: 15,
    passed: score >= 12,
    issues,
  };
}
