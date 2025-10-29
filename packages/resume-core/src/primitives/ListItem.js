/**
 * ListItem Primitive
 * Experience/Education list item with consistent structure
 *
 * @param {Object} options - ListItem options
 * @param {string} options.title - Item title (job title, degree)
 * @param {string} [options.subtitle] - Subtitle (company, institution)
 * @param {string} [options.dateRange] - Date range (rendered by DateRange)
 * @param {string} [options.location] - Location text
 * @param {string} [options.description] - Main description
 * @param {string[]} [options.highlights] - Bullet points
 * @param {string} [options.className] - Additional CSS classes
 * @returns {string} HTML string
 *
 * @example
 * ListItem({
 *   title: 'Senior Software Engineer',
 *   subtitle: 'Acme Corp',
 *   dateRange: 'Jan 2020 - Present',
 *   location: 'San Francisco, CA',
 *   highlights: ['Led team of 5', 'Increased performance by 40%']
 * })
 */
export function ListItem({
  title,
  subtitle,
  dateRange,
  location,
  description,
  highlights = [],
  className = '',
}) {
  const classes = ['resume-item', className].filter(Boolean).join(' ');

  const subtitleHtml = subtitle
    ? `<div class="resume-item-subtitle">${subtitle}</div>`
    : '';

  const metaItems = [];
  if (dateRange)
    metaItems.push(`<span class="resume-date">${dateRange}</span>`);
  if (location)
    metaItems.push(`<span class="resume-location">${location}</span>`);

  const metaHtml =
    metaItems.length > 0
      ? `<div class="resume-item-meta">${metaItems.join(' • ')}</div>`
      : '';

  const descriptionHtml = description
    ? `<p class="resume-description">${description}</p>`
    : '';

  const highlightsHtml =
    highlights.length > 0
      ? `<ul class="resume-highlights">
${highlights.map((h) => `  <li>${h}</li>`).join('\n')}
</ul>`
      : '';

  return `<div class="${classes}">
  <div class="resume-item-header">
    <div class="resume-item-title">${title}</div>
  </div>
  ${subtitleHtml}
  ${metaHtml}
  ${descriptionHtml}
  ${highlightsHtml}
</div>`;
}

export default ListItem;
