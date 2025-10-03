/**
 * Format location object into a readable string
 * @param {Object} location - Location object with city, region, countryCode, postalCode
 * @returns {string} Formatted location string
 */
export function formatLocation(location) {
  if (!location) return 'Location not provided';

  const {
    postalCode = '',
    city = '',
    region = '',
    countryCode = '',
  } = location;

  const locationParts = [city, region, postalCode, countryCode].filter(
    (part) => part.trim() !== ''
  );

  return locationParts.length === 0
    ? 'Location not provided'
    : locationParts.join(', ');
}
