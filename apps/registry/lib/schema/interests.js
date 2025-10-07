/**
 * Interests schema
 */
export const interests = {
  type: 'array',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      name: {
        type: 'string',
        description: 'e.g. Philosophy',
      },
      keywords: {
        type: 'array',
        additionalItems: false,
        items: {
          type: 'string',
          description: 'e.g. Friedrich Nietzsche',
        },
      },
    },
  },
};
