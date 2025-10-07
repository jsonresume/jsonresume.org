/**
 * Skills schema
 */
export const skills = {
  type: 'array',
  description: 'List out your professional skill-set',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      name: {
        type: 'string',
        description: 'e.g. Web Development',
      },
      level: {
        type: 'string',
        description: 'e.g. Master',
      },
      keywords: {
        type: 'array',
        description: 'List some keywords pertaining to this skill',
        additionalItems: false,
        items: {
          type: 'string',
          description: 'e.g. HTML',
        },
      },
    },
  },
};
