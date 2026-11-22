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
      custom: { $ref: '#/definitions/custom' },
      scale: {
        type: 'object',
        description:
          'The level on a published scale, e.g. { framework: "CEFR", level: "C1" } (#315)',
        additionalProperties: true,
        properties: {
          framework: { type: 'string' },
          level: { type: 'string' },
        },
      },
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
