/**
 * Section Primitive
 * Wrapper for resume sections with consistent spacing
 *
 * @param {Object} options - Section options
 * @param {string} options.content - Section content (HTML string)
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.id] - Section ID for navigation
 * @returns {string} HTML string
 *
 * @example
 * Section({
 *   id: 'work-experience',
 *   content: '<h2>Work Experience</h2><div>...</div>'
 * })
 */
export function Section({ content, className = '', id }) {
  const classes = ['resume-section', className].filter(Boolean).join(' ');
  const idAttr = id ? ` id="${id}"` : '';

  return `<section class="${classes}"${idAttr}>
  ${content}
</section>`;
}

export default Section;
