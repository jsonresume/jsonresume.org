/**
 * ATS Endpoint documentation data
 */

export const scoringCategories = [
  {
    category: 'Contact Information',
    points: 20,
    description: 'Name, email, phone, location completeness and validity',
  },
  {
    category: 'Work Experience',
    points: 20,
    description: 'Company names, job titles, dates, descriptions, highlights',
  },
  {
    category: 'Education',
    points: 15,
    description: 'Institution names, degrees, study areas',
  },
  {
    category: 'Skills',
    points: 15,
    description: 'Skill categories, keyword count, variety',
  },
  {
    category: 'Keywords & Content',
    points: 15,
    description: 'Summary length, highlights count, overall word count',
  },
  {
    category: 'Date Formatting',
    points: 10,
    description: 'Consistent date formats, no missing dates',
  },
  {
    category: 'Theme Compatibility',
    points: 5,
    description: 'ATS-friendly theme selection',
  },
];

export const ratingScale = [
  {
    label: 'Excellent (90-100)',
    description: 'Your resume is highly optimized for ATS',
  },
  {
    label: 'Good (75-89)',
    description: 'Well-optimized with minor improvements needed',
  },
  {
    label: 'Fair (60-74)',
    description: 'Needs some improvements for better compatibility',
  },
  {
    label: 'Poor (40-59)',
    description: 'Needs significant improvements',
  },
  {
    label: 'Needs Improvement (0-39)',
    description: 'Critical issues that must be addressed',
  },
];

export const severityLevels = [
  {
    level: 'Critical',
    color: 'text-red-600',
    description:
      'Missing required fields (name, email) - ATS will likely reject',
  },
  {
    level: 'Warning',
    color: 'text-yellow-600',
    description: 'Missing recommended fields - reduces ATS score',
  },
  {
    level: 'Info',
    color: 'text-blue-600',
    description: 'Suggestions for optimization - nice to have',
  },
];

export const bestPractices = [
  'Use standard section headings (Work Experience, Education, Skills)',
  'Include relevant keywords from job descriptions',
  'Avoid images, tables, and complex formatting',
  'Use standard fonts and simple layouts',
  'Include full contact information',
  'Use consistent date formats (YYYY-MM-DD recommended)',
  'Add specific achievements and metrics in work highlights',
  'List multiple skills across different categories',
  'Choose ATS-friendly themes (stackoverflow, professional, elegant, kendall, flat)',
];
