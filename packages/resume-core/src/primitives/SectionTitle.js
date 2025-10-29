/**
 * SectionTitle Primitive
 * Styled section headings with optional icons
 *
 * @param {Object} options - Title options
 * @param {string} options.title - Section title text
 * @param {string} [options.icon] - Optional emoji/icon before title
 * @param {string} [options.level] - Heading level (default: 'h2')
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 *
 * @example
 * SectionTitle({ title: 'Work Experience', icon: '💼' })
 * // <h2 class="resume-section-title"><span class="icon">💼</span> Work Experience</h2>
 */
export function SectionTitle({ title, icon, level = 'h2', className = '' }) {
  const classes = ['resume-section-title', className].filter(Boolean).join(' ');
  const iconHtml = icon
    ? `<span class="resume-icon" aria-hidden="true">${icon}</span> `
    : '';

  return `<${level} class="${classes}">${iconHtml}${title}</${level}>`;
}

export default SectionTitle;
