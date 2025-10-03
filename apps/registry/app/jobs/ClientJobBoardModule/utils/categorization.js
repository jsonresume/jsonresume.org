/**
 * Normalize string for categorization
 * @param {string} str - String to normalize
 * @returns {string} Normalized string
 */
export const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

/**
 * Categorize job type
 * @param {string} type - Job type string
 * @returns {string} Categorized job type
 */
export const categorizeJobType = (type) => {
  const normalized = normalizeString(type);

  if (normalized.includes('contract')) return 'Contract';
  if (normalized.includes('fulltime') || normalized.includes('full'))
    return 'Full-time';
  if (normalized.includes('parttime') || normalized.includes('part'))
    return 'Part-time';
  if (normalized.includes('intern')) return 'Internship';
  if (normalized.includes('temp')) return 'Temporary';
  if (normalized.includes('hybrid')) return 'Hybrid';
  if (normalized.includes('remote')) return 'Remote';

  return 'Other';
};

/**
 * Categorize experience level
 * @param {string} exp - Experience string
 * @returns {string} Categorized experience level
 */
export const categorizeExperience = (exp) => {
  const normalized = normalizeString(exp);

  if (normalized.includes('entry') || normalized.includes('junior'))
    return 'Entry Level';
  if (normalized.includes('mid') || normalized.includes('intermediate'))
    return 'Mid Level';
  if (normalized.includes('senior') || normalized.includes('sr'))
    return 'Senior Level';
  if (normalized.includes('lead') || normalized.includes('principal'))
    return 'Lead';
  if (normalized.includes('manager') || normalized.includes('head'))
    return 'Manager';
  if (normalized.includes('exec') || normalized.includes('director'))
    return 'Executive';

  return 'Not Specified';
};

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

/**
 * Categorize location type
 * @param {string} location - Location string
 * @returns {string} Categorized location
 */
export const categorizeLocation = (location) => {
  if (!location) return 'Not Specified';

  // If it's already in the City, Region, Country format, return as is
  if (location.includes(',')) return location;

  const normalized = normalizeString(location);

  if (normalized.includes('remote')) return 'Remote';
  if (normalized.includes('hybrid')) return 'Hybrid';
  if (normalized.includes('onsite') || normalized.includes('office'))
    return 'On-site';

  return location;
};
