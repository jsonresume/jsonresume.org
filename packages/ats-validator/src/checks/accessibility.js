/**
 * Check accessibility features
 */
export function checkAccessibility($) {
  const issues = [];
  let score = 15;

  // Check for lang attribute
  if (!$('html').attr('lang')) {
    issues.push({
      severity: 'warning',
      message:
        'Missing lang attribute on <html> - specify language for screen readers and ATS',
    });
    score -= 2;
  }

  // Check for meaningful link text
  const links = $('a');
  links.each((i, el) => {
    const $link = $(el);
    const text = $link.text().trim();
    const badTexts = ['click here', 'here', 'read more', 'link'];

    if (badTexts.includes(text.toLowerCase())) {
      issues.push({
        severity: 'info',
        message: `Non-descriptive link text: "${text}" - use meaningful text like "View Portfolio" or "Download PDF"`,
      });
      score -= 1;
    }
  });

  // Check for form labels (if forms exist)
  const inputs = $('input, textarea, select');
  if (inputs.length > 0) {
    inputs.each((i, el) => {
      const $input = $(el);
      const id = $input.attr('id');
      if (id && $(`label[for="${id}"]`).length === 0) {
        issues.push({
          severity: 'warning',
          message: `Form input missing associated label`,
        });
        score -= 2;
      }
    });
  }

  return {
    name: 'Accessibility',
    score: Math.max(0, score),
    maxScore: 15,
    passed: score >= 12,
    issues,
  };
}
