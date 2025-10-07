/**
 * Languages schema
 */
export const languages = {
  type: 'array',
  description: 'List any other languages you speak',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      language: {
        type: 'string',
        description: 'e.g. English, Spanish',
      },
      fluency: {
        type: 'string',
        description: 'e.g. Fluent, Beginner',
      },
    },
  },
};
