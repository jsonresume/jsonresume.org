/**
 * Awards schema
 */
export const awards = {
  type: 'array',
  description:
    'Specify any awards you have received throughout your professional career',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      title: {
        type: 'string',
        description: 'e.g. One of the 100 greatest minds of the century',
      },
      date: {
        $ref: '#/definitions/iso8601',
      },
      awarder: {
        type: 'string',
        description: 'e.g. Time Magazine',
      },
      summary: {
        type: 'string',
        description: 'e.g. Received for my work with Quantum Physics',
      },
    },
  },
};
