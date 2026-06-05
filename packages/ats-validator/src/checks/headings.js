/**
 * Check heading structure
 */
export function checkHeadings($) {
  const issues = [];
  let score = 10;

  const headings = $('h1, h2, h3, h4, h5, h6');

  if (headings.length < 3) {
    issues.push({
      severity: 'warning',
      message: `Only ${headings.length} headings found - use headings to structure resume sections (Work, Education, Skills, etc.)`,
    });
    score -= 4;
  }

  // Check if headings have meaningful text
  headings.each((i, el) => {
    const text = $(el).text().trim();
    if (text.length === 0) {
      issues.push({
        severity: 'error',
        message: `Empty ${el.tagName} heading found`,
      });
      score -= 2;
    } else if (text.length < 3) {
      issues.push({
        severity: 'warning',
        message: `Very short heading: "${text}" - use descriptive section titles`,
      });
      score -= 1;
    }
  });

  return {
    name: 'Heading Structure',
    score: Math.max(0, score),
    maxScore: 10,
    passed: score >= 7,
    issues,
  };
}
