export function formatSalary(salary, salaryUsd) {
  if (salaryUsd) return `$${Math.round(salaryUsd / 1000)}k`;
  if (salary) return salary;
  return '—';
}

export function formatLocation(loc, remote) {
  const parts = [];
  if (loc?.city) parts.push(loc.city);
  if (loc?.countryCode) parts.push(loc.countryCode);
  if (remote) parts.push(`(${remote})`);
  return parts.join(', ') || '—';
}

export function stateIcon(state) {
  const icons = {
    interested: '⭐',
    applied: '📨',
    not_interested: '✗',
    dismissed: '👁',
    maybe: '?',
  };
  return icons[state] || ' ';
}

export function stateColor(state) {
  const colors = {
    interested: 'green',
    applied: 'blue',
    not_interested: 'red',
    dismissed: 'gray',
    maybe: 'yellow',
  };
  return colors[state] || 'white';
}

export function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len - 1) + '…' : str;
}

/**
 * Render a score as a sparkline bar: ████░░░░ 0.72
 * Uses Unicode block characters for sub-character precision.
 */
const BLOCKS = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];

export function scoreBar(score, width = 6) {
  if (typeof score !== 'number' || isNaN(score)) return '░'.repeat(width);
  const clamped = Math.max(0, Math.min(1, score));
  const filled = clamped * width;
  const full = Math.floor(filled);
  const frac = Math.round((filled - full) * 8);
  const empty = width - full - (frac > 0 ? 1 : 0);
  return (
    '█'.repeat(full) +
    (frac > 0 ? BLOCKS[frac] : '') +
    '░'.repeat(Math.max(0, empty))
  );
}

export function stateLabel(state) {
  const labels = {
    interested: 'Interested',
    applied: 'Applied',
    not_interested: 'Passed',
    dismissed: 'Dismissed',
    maybe: 'Maybe',
  };
  return labels[state] || '';
}
