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
