/**
 * Shared schema definitions
 */
export const definitions = {
  iso8601: {
    type: 'string',
    description:
      'Similar to the standard date type, but each section after the year is optional. e.g. 2014-06-29 or 2023-04. The value can also be an empty string for ongoing roles.',
    pattern:
      '^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3}|)$',
  },
};
