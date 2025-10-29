/**
 * Badge Primitive
 * Display skills, keywords, tags in a badge format
 *
 * @param {Object} options - Badge options
 * @param {string} options.text - Badge text content
 * @param {string} [options.variant] - Style variant: 'default', 'accent', 'secondary'
 * @param {string} [options.size] - Size: 'sm', 'md' (default), 'lg'
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 *
 * @example
 * Badge({ text: 'JavaScript', variant: 'accent' })
 * // <span class="resume-badge resume-badge-accent">JavaScript</span>
 */
export function Badge({
  text,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const classes = [
    'resume-badge',
    `resume-badge-${variant}`,
    `resume-badge-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return `<span class="${classes}">${text}</span>`;
}

/**
 * BadgeList - Render multiple badges
 *
 * @param {Object} options - BadgeList options
 * @param {string[]} options.items - Array of badge texts
 * @param {string} [options.variant] - Style variant for all badges
 * @param {string} [options.size] - Size for all badges
 * @param {string} [options.className] - Additional CSS classes for container
 * @returns {string} HTML string
 *
 * @example
 * BadgeList({ items: ['React', 'TypeScript', 'Node.js'], variant: 'accent' })
 */
export function BadgeList({
  items,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  if (!items || items.length === 0) return '';

  const classes = ['resume-badge-list', className].filter(Boolean).join(' ');

  const badges = items
    .map((text) => Badge({ text, variant, size }))
    .join('\n  ');

  return `<div class="${classes}">
  ${badges}
</div>`;
}

export default Badge;
