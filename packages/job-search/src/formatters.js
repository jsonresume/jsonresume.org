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

export function formatAge(postedAt) {
  if (!postedAt) return '';
  const days = Math.floor(
    (Date.now() - new Date(postedAt).getTime()) / 86400000
  );
  if (days === 0) return 'today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
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
