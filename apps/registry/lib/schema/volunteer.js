/**
 * Volunteer work schema
 */
export const volunteer = {
  type: 'array',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      organization: {
        type: 'string',
        description: 'e.g. Facebook',
      },
      position: {
        type: 'string',
        description: 'e.g. Software Engineer',
      },
      url: {
        type: 'string',
        description: 'e.g. http://facebook.example.com',
        format: 'uri',
      },
      startDate: {
        $ref: '#/definitions/iso8601',
      },
      endDate: {
        $ref: '#/definitions/iso8601',
      },
      summary: {
        type: 'string',
        description: 'Give an overview of your responsibilities at the company',
      },
      highlights: {
        type: 'array',
        description: 'Specify accomplishments and achievements',
        additionalItems: false,
        items: {
          type: 'string',
          description:
            'e.g. Increased profits by 20% from 2011-2012 through viral advertising',
        },
      },
    },
  },
};
