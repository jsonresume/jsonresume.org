import { normalizeString } from './normalizeString';

/**
 * Categorize salary range
 * @param {string} salary - Salary string
 * @returns {string} Categorized salary range
 */
export const categorizeSalary = (salary) => {
  if (!salary) return 'Not Specified';

  const normalized = normalizeString(salary);

  if (normalized.includes('competitive')) return 'Competitive';

  // Extract the first number found in the string
  const numbers = salary.match(/\d+/g);
  if (!numbers) return 'Not Specified';

  const firstNumber = parseInt(numbers[0], 10);

  if (normalized.includes('k')) {
    if (firstNumber < 50) return 'Under $50k';
    if (firstNumber < 100) return '$50k - $100k';
    if (firstNumber < 150) return '$100k - $150k';
    if (firstNumber < 200) return '$150k - $200k';
    return '$200k+';
  }

  if (firstNumber < 50000) return 'Under $50k';
  if (firstNumber < 100000) return '$50k - $100k';
  if (firstNumber < 150000) return '$100k - $150k';
  if (firstNumber < 200000) return '$150k - $200k';
  return '$200k+';
};
