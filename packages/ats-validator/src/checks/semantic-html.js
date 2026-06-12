/**
 * Check for semantic HTML structure
 */
export function checkSemanticHTML($) {
  const issues = [];
  let score = 10;

  // Check for proper document structure
  if ($('header').length === 0) {
    issues.push({
      severity: 'warning',
      message: 'Missing <header> element for contact information',
    });
    score -= 2;
  }

  if ($('section').length === 0) {
    issues.push({
      severity: 'warning',
      message:
        'No <section> elements found - use semantic sections for resume content',
    });
    score -= 2;
  }

  // Check for semantic headings
  const h1Count = $('h1').length;
  if (h1Count === 0) {
    issues.push({
      severity: 'error',
      message: 'Missing <h1> for name - ATS systems look for primary heading',
    });
    score -= 3;
  } else if (h1Count > 1) {
    issues.push({
      severity: 'warning',
      message: `Multiple <h1> tags (${h1Count}) - should only have one for name`,
    });
    score -= 2;
  }

  // Check for proper heading hierarchy
  const headings = $('h1, h2, h3, h4, h5, h6').toArray();
  const levels = headings.map((h) => parseInt(h.tagName[1]));

  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      issues.push({
        severity: 'info',
        message: `Heading hierarchy skip detected (${
          headings[i - 1].tagName
        } → ${headings[i].tagName})`,
      });
      score -= 1;
      break;
    }
  }

  return {
    name: 'Semantic HTML',
    score,
    maxScore: 10,
    passed: score >= 7,
    issues,
  };
}
