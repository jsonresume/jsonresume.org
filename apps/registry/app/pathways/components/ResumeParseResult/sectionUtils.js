import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Calendar,
  Upload,
} from 'lucide-react';

/**
 * Get the icon component for a resume section
 */
export function getSectionIcon(section) {
  switch (section) {
    case 'basics':
      return User;
    case 'work':
      return Briefcase;
    case 'education':
      return GraduationCap;
    case 'skills':
      return Code;
    case 'awards':
      return Award;
    case 'projects':
      return Upload;
    default:
      return Calendar;
  }
}

/**
 * Format a preview string for a section
 */
export function formatSectionPreview(section, data) {
  switch (section) {
    case 'basics':
      return `${data.name || 'Name'} • ${data.email || 'Email'} • ${
        data.phone || 'Phone'
      }`;
    case 'work':
      return `${data.length} position${data.length !== 1 ? 's' : ''} at ${data
        .slice(0, 2)
        .map((job) => job.name)
        .join(', ')}${data.length > 2 ? '...' : ''}`;
    case 'education':
      return `${data.length} degree${data.length !== 1 ? 's' : ''} from ${data
        .slice(0, 2)
        .map((edu) => edu.institution)
        .join(', ')}${data.length > 2 ? '...' : ''}`;
    case 'skills':
      return `${data.length} skill${data.length !== 1 ? 's' : ''}: ${data
        .slice(0, 3)
        .map((skill) => skill.name)
        .join(', ')}${data.length > 3 ? '...' : ''}`;
    case 'awards':
      return `${data.length} award${data.length !== 1 ? 's' : ''}: ${data
        .slice(0, 2)
        .map((award) => award.title)
        .join(', ')}${data.length > 2 ? '...' : ''}`;
    case 'projects':
      return `${data.length} project${data.length !== 1 ? 's' : ''}: ${data
        .slice(0, 2)
        .map((proj) => proj.name)
        .join(', ')}${data.length > 2 ? '...' : ''}`;
    default:
      return `${data.length || 0} item${data.length !== 1 ? 's' : ''}`;
  }
}

/**
 * Sort sections into display order
 */
export function sortSections(entries) {
  const order = ['basics', 'work', 'education', 'skills', 'awards', 'projects'];
  return entries.sort(([a], [b]) => order.indexOf(a) - order.indexOf(b));
}

/**
 * Check if section has valid data
 */
export function hasValidData(data) {
  return (
    data &&
    (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
  );
}
