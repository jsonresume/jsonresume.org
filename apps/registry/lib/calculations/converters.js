/**
 * Converts decimal years to years, months, and days
 * @param {number} totalYears - Total years as decimal
 * @returns {Object} Object with years, months, days
 */
export function convertYearsToYearsMonthsDays(totalYears) {
  const years = Math.floor(totalYears);
  const totalMonths = (totalYears - years) * 12;
  const months = Math.floor(totalMonths);
  const days = Math.round((totalMonths - months) * 30);

  return { years, months, days };
}
