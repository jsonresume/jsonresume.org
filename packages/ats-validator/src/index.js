/**
 * @resume/ats-validator
 * Machine-readable validation rules for ATS-friendly resume HTML
 *
 * Based on research:
 * - 68% of hiring managers prefer sans-serif fonts (Adobe 2025)
 * - Single-column layouts parse 3x better than multi-column
 * - Tables and complex layouts confuse 90% of ATS systems
 * - Standard fonts (Helvetica, Arial, Calibri) have 99% compatibility
 */

import * as cheerio from 'cheerio';

/**
 * Validate HTML against ATS best practices
 * @param {string} html - HTML string to validate
 * @returns {Object} Validation results with score and issues
 */
export function validateATS(html) {
  const $ = cheerio.load(html);

  const checks = [
    checkSemanticHTML($),
    checkFonts($),
    checkTables($),
    checkLayout($),
    checkHeadings($),
    checkImages($),
    checkFontSizes($),
    checkAccessibility($),
  ];

  const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
  const maxScore = checks.reduce((sum, check) => sum + check.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  const issues = checks.flatMap((check) => check.issues);
  const passed = checks.filter((check) => check.passed).length;
  const failed = checks.length - passed;

  return {
    score: percentage,
    grade: getGrade(percentage),
    totalScore,
    maxScore,
    passed,
    failed,
    checks,
    issues,
    atsCompatibility:
      percentage >= 80
        ? 'excellent'
        : percentage >= 60
        ? 'good'
        : percentage >= 40
        ? 'fair'
        : 'poor',
  };
}

/**
 * Check for semantic HTML structure
 */
function checkSemanticHTML($) {
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

/**
 * Check for ATS-friendly fonts
 */
function checkFonts($) {
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

/**
 * Check for problematic tables
 */
function checkTables($) {
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

/**
 * Check for single-column layout
 */
function checkLayout($) {
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

/**
 * Check heading structure
 */
function checkHeadings($) {
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

/**
 * Check for problematic images
 */
function checkImages($) {
  const issues = [];
  let score = 10;

  const images = $('img');

  images.each((i, el) => {
    const $img = $(el);
    const alt = $img.attr('alt');

    if (!alt || alt.trim().length === 0) {
      issues.push({
        severity: 'warning',
        message:
          'Image missing alt text - ATS systems cannot read images, ensure text alternatives exist',
      });
      score -= 2;
    }
  });

  // Warn about excessive images
  if (images.length > 5) {
    issues.push({
      severity: 'info',
      message: `${images.length} images found - ATS systems ignore images, ensure all information is in text`,
    });
    score -= 2;
  }

  return {
    name: 'Image Accessibility',
    score: Math.max(0, score),
    maxScore: 10,
    passed: score >= 8,
    issues,
  };
}

/**
 * Check font sizes
 */
function checkFontSizes($) {
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

/**
 * Check accessibility features
 */
function checkAccessibility($) {
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

/**
 * Get letter grade from percentage
 */
function getGrade(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

/**
 * Get recommendations based on validation results
 */
export function getRecommendations(validationResult) {
  const recs = [];

  if (validationResult.score < 60) {
    recs.push(
      '⚠️ Critical: Your resume has significant ATS compatibility issues. Focus on the errors below.'
    );
  }

  validationResult.checks.forEach((check) => {
    if (!check.passed) {
      recs.push(
        `📋 ${check.name}: ${check.score}/${check.maxScore} - Review and fix issues in this category`
      );
    }
  });

  const errorCount = validationResult.issues.filter(
    (i) => i.severity === 'error'
  ).length;
  if (errorCount > 0) {
    recs.push(
      `🚨 ${errorCount} critical error(s) found - these will likely prevent ATS parsing`
    );
  }

  if (validationResult.score >= 80) {
    recs.push(
      '✅ Great! Your resume is highly ATS-compatible. Minor improvements possible.'
    );
  }

  return recs;
}

export default { validateATS, getRecommendations };
