/**
 * Check for problematic tables
 */
export function checkTables($) {
  const issues = [];
  let score = 15;

  const tables = $('table').length;

  if (tables > 0) {
    issues.push({
      severity: 'error',
      message: `Found ${tables} table(s) - ATS systems struggle with table-based layouts. Use semantic HTML instead.`,
    });
    score -= 10;

    // Check if tables are used for layout
    const layoutTables = $('table').filter((i, el) => {
      const $table = $(el);
      return $table.find('td').length > 3; // Likely a layout table
    }).length;

    if (layoutTables > 0) {
      issues.push({
        severity: 'error',
        message:
          'Tables appear to be used for layout - this will break ATS parsing',
      });
      score -= 5;
    }
  }

  return {
    name: 'No Table Layouts',
    score,
    maxScore: 15,
    passed: score >= 13,
    issues,
  };
}
