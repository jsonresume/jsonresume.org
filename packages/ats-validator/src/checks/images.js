/**
 * Check for problematic images
 */
export function checkImages($) {
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
