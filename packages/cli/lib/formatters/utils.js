// Shared helpers for the theme-less resume formatters (markdown + text).

const isNonEmptyArray = (value) => Array.isArray(value) && value.length > 0;

const dateRange = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return '';
  }
  return `${startDate || ''} - ${endDate || 'Present'}`;
};

// Flatten a contact line out of basics: email, phone, url and a one-line
// location. Returns an array of fragments (caller decides the separator).
const contactParts = (basics = {}) => {
  const parts = [];
  if (basics.email) {
    parts.push(basics.email);
  }
  if (basics.phone) {
    parts.push(basics.phone);
  }
  if (basics.url) {
    parts.push(basics.url);
  }
  const loc = basics.location;
  if (loc) {
    const locParts = [
      loc.address,
      loc.city,
      loc.region,
      loc.postalCode,
      loc.countryCode,
    ].filter(Boolean);
    if (locParts.length) {
      parts.push(locParts.join(', '));
    }
  }
  return parts;
};

// Build a section block: returns [] when there are no items, otherwise the
// `headerLines` followed by each rendered item (separated by a blank line).
const section = (headerLines, items, renderItem) => {
  if (!isNonEmptyArray(items)) {
    return [];
  }
  const lines = ['', ...headerLines];
  items.forEach((item) => {
    lines.push('', ...renderItem(item));
  });
  return lines;
};

module.exports = {
  isNonEmptyArray,
  dateRange,
  contactParts,
  section,
};
