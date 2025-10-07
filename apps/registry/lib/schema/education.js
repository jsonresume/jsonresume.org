/**
 * Education schema
 */
export const education = {
  type: 'array',
  additionalItems: false,
  items: {
    type: 'object',
    additionalProperties: true,
    properties: {
      institution: {
        type: 'string',
        description: 'e.g. Massachusetts Institute of Technology',
      },
      url: {
        type: 'string',
        description: 'e.g. http://facebook.example.com',
        format: 'uri',
      },
      area: {
        type: 'string',
        description: 'e.g. Arts',
      },
      studyType: {
        type: 'string',
        description: 'e.g. Bachelor',
      },
      startDate: {
        $ref: '#/definitions/iso8601',
      },
      endDate: {
        $ref: '#/definitions/iso8601',
      },
      score: {
        type: 'string',
        description: 'grade point average, e.g. 3.67/4.0',
      },
      courses: {
        type: 'array',
        description: 'List notable courses/subjects',
        additionalItems: false,
        items: {
          type: 'string',
          description: 'e.g. H1302 - Introduction to American history',
        },
      },
    },
  },
};
