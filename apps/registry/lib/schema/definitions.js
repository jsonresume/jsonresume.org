/**
 * Shared schema definitions
 */
export const definitions = {
  location: {
    type: 'object',
    additionalProperties: true,
    properties: {
      address: {
        type: 'string',
        description:
          'To add multiple address lines, use \n. For example, 1234 Glücklichkeit Straße\nHinterhaus 5. Etage li.',
      },
      postalCode: { type: 'string' },
      city: { type: 'string' },
      countryCode: {
        type: 'string',
        description: 'code as per ISO-3166-1 ALPHA-2, e.g. US, AU, IN',
      },
      region: { type: 'string' },
    },
  },
  custom: {
    type: 'object',
    description:
      'Tool- or author-specific data that has no standard field yet. Keys are free-form; namespace them by tool. Themes are not expected to render it.',
    additionalProperties: true,
  },
  iso8601: {
    type: 'string',
    description:
      'Similar to the standard date type, but each section after the year is optional. e.g. 2014-06-29 or 2023-04. The value can also be an empty string for ongoing roles.',
    pattern:
      '^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3}|)$',
  },
};
