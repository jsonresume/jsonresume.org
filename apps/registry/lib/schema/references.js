/**
 * References schema
 */
export const references = {
  type: 'array',
  description: 'List references you have received',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      name: {
        type: 'string',
        description: 'e.g. Timothy Cook',
      },
      reference: {
        type: 'string',
        description:
          'e.g. Joe blogs was a great employee, who turned up to work at least once a week. He exceeded my expectations when it came to doing nothing.',
      },
    },
  },
};
