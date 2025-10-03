/**
 * Calculate duration in days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date (defaults to now)
 * @returns {number} Duration in days
 */
export function calculateDurationInDays(startDate, endDate = new Date()) {
  return (endDate - startDate) / (1000 * 60 * 60 * 24);
}

/**
 * Convert days to years, months, and days
 * @param {number} totalDays - Total days
 * @returns {Object} Object with years, months, days
 */
export function daysToYearsMonthsDays(totalDays) {
  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = Math.round(remainingDaysAfterYears % 30);

  return { years, months, days };
}

/**
 * Merge overlapping date ranges
 * @param {Array} dateRanges - Array of {startDate, endDate} objects
 * @returns {Array} Merged non-overlapping date ranges
 */
export function mergeOverlappingRanges(dateRanges) {
  if (dateRanges.length === 0) return [];

  // Sort by start date
  const sorted = [...dateRanges].sort((a, b) => a.startDate - b.startDate);

  const merged = [];
  let currentRange = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const nextRange = sorted[i];
    if (currentRange.endDate >= nextRange.startDate) {
      // Extend current range
      currentRange.endDate = new Date(
        Math.max(currentRange.endDate, nextRange.endDate)
      );
    } else {
      // No overlap, push current and start new
      merged.push(currentRange);
      currentRange = nextRange;
    }
  }

  merged.push(currentRange);
  return merged.filter(Boolean);
}
